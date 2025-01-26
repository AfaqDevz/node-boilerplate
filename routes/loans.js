import express from "express";
import Loan from "../models/loan.js";
import User from "../models/user.js";
import sendRes from "../helper/sendRes.js";

const router = express.Router();
router.post("/request", async (req, res) => {
    try {
        const {
            userId,
            cnic,
            category,
            subcategory,
            loanAmount,
            monthlyPayment,
            initialDeposit,
            loanPeriod,
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
        } = req.body;

        // const userId = req.user.id;
        if (!category || !subcategory || !initialDeposit || !loanPeriod || !address || !phoneNumber) {
            return sendRes(res, 400, null, true, "Missing required fields");
        }

        const loan = new Loan({
            userId,
            cnic,
            category,
            subcategory,
            loanAmount,
            monthlyPayment,
            initialDeposit,
            loanPeriod,
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
            phoneNumber,
            status: "pending"
        });

        await loan.save();
        sendRes(res, 201, loan, false, "Loan request submitted successfully");
    } catch (error) {
        console.error(error);
        sendRes(res, 500, null, true, "Error submitting loan request");
    }
});

router.get("/details/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const loans = await Loan.find({ userId }).sort({ createdAt: -1 });
        sendRes(res, 200, loans, false, "Loan details retrieved successfully");
    } catch (error) {
        console.error(error);
        sendRes(res, 500, null, true, "Error retrieving loan details");
    }
});

router.get("/profile", async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return sendRes(res, 404, null, true, "User not found");
        }
        sendRes(res, 200, user, false, "User profile retrieved successfully");
    } catch (error) {
        console.error(error);
        sendRes(res, 500, null, true, "Error retrieving user profile");
    }
});

router.put("/profile", async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phoneNumber } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phoneNumber },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return sendRes(res, 404, null, true, "User not found");
        }

        sendRes(res, 200, updatedUser, false, "User profile updated successfully");
    } catch (error) {
        console.error(error);
        sendRes(res, 500, null, true, "Error updating user profile");
    }
});

router.get("/stats", async (req, res) => {
    try {
        const userId = req.user.id;
        const totalLoans = await Loan.countDocuments({ userId });
        const pendingLoans = await Loan.countDocuments({ userId, status: "Pending" });
        const approvedLoans = await Loan.countDocuments({ userId, status: "Approved" });
        const rejectedLoans = await Loan.countDocuments({ userId, status: "Rejected" });

        const stats = {
            totalLoans,
            pendingLoans,
            approvedLoans,
            rejectedLoans
        };

        sendRes(res, 200, stats, false, "Loan statistics retrieved successfully");
    } catch (error) {
        console.error(error);
        sendRes(res, 500, null, true, "Error retrieving loan statistics");
    }
});

router.get('/admin', async (req, res) => {
    try {
        const allLoans = await Loan.find();
        sendRes(res, 200, allLoans, false, 'All Loan details');
    }
    catch (e) {
        sendRes(res, 500, null, true, "Error all loan details");

    }
})

router.put('/admin', async (req, res) => {
    try {

        const { id, status } = req.body;

        const loansdetails = await Loan.findByIdAndUpdate(id, { status });

        sendRes(res, 200, loansdetails, false, "Loan details retrieved successfully");
    } catch (error) {
        console.error(error);
        sendRes(res, 500, null, true, "Error retrieving loan details");
    }
})

export default router;