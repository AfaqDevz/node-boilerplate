import express from "express";
const router = express.Router()
import sendRes from "../helper/sendRes.js"
import Loan from "../models/loan.js"
import auth from "../middleware/authValid.js"

router.post("/request", auth, async (req, res) => {
    try {
        const {
            category,
            subcategory,
            amount,
            guarantor1Name,
            guarantor1Email,
            guarantor1Location,
            guarantor1CNIC,
            guarantor2Name,
            guarantor2Email,
            guarantor2Location,
            guarantor2CNIC,
            address,
            phoneNumber
        } = req.body

        const userId = req.user.id

        const loan = new Loan({
            userId,
            category,
            subcategory,
            amount,
            guarantor1: {
                name: guarantor1Name,
                email: guarantor1Email,
                location: guarantor1Location,
                cnic: guarantor1CNIC
            },
            guarantor2: {
                name: guarantor2Name,
                email: guarantor2Email,
                location: guarantor2Location,
                cnic: guarantor2CNIC
            },
            address,
            phoneNumber
        })

        await loan.save()
        sendRes(res, 201, loan, false, "Loan request submitted successfully")
    } catch (error) {
        console.error(error)
        sendRes(res, 400, null, true, error.message || "Error submitting loan request")
    }
})

router.get("/details/:userId", auth, async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.params.userId })
        sendRes(res, 200, loans, false, "Loan details retrieved successfully")
    } catch (error) {
        console.error(error)
        sendRes(res, 400, null, true, error.message || "Error retrieving loan details")
    }
})

export default router