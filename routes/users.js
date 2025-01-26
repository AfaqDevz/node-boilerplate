import express from "express";
import User from "../models/user.js";
import sendRes from "../helper/sendRes.js";
import crypto from "crypto";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import auth from "../middleware/authValid.js";

const router = express.Router();

// router.get('/', async (req, res) => {
//     const allUsers = await User.find().select('-password');
// router.get('/', async (req, res) => {
//     const allUsers = await User.find().select('-password');

//     sendRes(res, 201, allUsers, false, 'All Users found!');
// })
//     sendRes(res, 201, allUsers, false, 'All Users found!');
// })

// router.get('/:username', async (req, res) => {
//     const findUsername = await User.findOne({ username: req.params.username }).select('-password');;
// router.get('/:username', async (req, res) => {
//     const findUsername = await User.findOne({ username: req.params.username }).select('-password');;

//     if (!findUsername) {
//         return sendRes(res, 404, null, true, 'User not found!')
//     }
//     if (!findUsername) {
//         return sendRes(res, 404, null, true, 'User not found!')
//     }

//     sendRes(res, 201, findUsername, false, 'User found!')
// })

function generateTemporaryPassword() {
    return crypto.randomBytes(8).toString("hex")
}

async function sendTemporaryPasswordEmail(email, tempPassword) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'idfortable@gmail.com',
            pass: 'acmy dqer dyed nzge',
        },
    });

    const mailOptions = {
        from: 'idfortable@gmail.com',
        to: email,
        subject: 'Your Temporary Password',
        text: `Your temporary password is: ${tempPassword}. Please log in and change your password immediately.`,
        html: `<p>Your temporary password is: <strong>${tempPassword}</strong>. Please log in and change your password immediately.</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

router.post("/register", async (req, res) => {
    try {
        const { cnic, email, name } = req.body

        let user = await User.findOne({ email })
        if (user) {
            return sendRes(res, 400, null, true, "User already exists")
        }

        const tempPassword = generateTemporaryPassword()

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(tempPassword, salt)

        user = new User({ cnic, email, name, password: hashedPassword, isFirstLogin: true })
        await user.save()

        await sendTemporaryPasswordEmail(email, tempPassword)

        sendRes(res, 201, null, false, "User registered successfully. Check your email for the temporary password.")
    } catch (error) {
        console.error(error)
        sendRes(res, 500, null, true, "Server error")
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return sendRes(res, 400, null, true, "Invalid credentials")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return sendRes(res, 400, null, true, "Invalid credentials")
        }

        const payload = {
            user: {
                id: user.id,
                isFirstLogin: user.isFirstLogin,
            },
        }

        jwt.sign(
            payload,
            "jwtSecret",
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err
                sendRes(res, 200, { token, isFirstLogin: user.isFirstLogin }, false, "Login successful")
            }
        )
    } catch (error) {
        console.error(error)
        sendRes(res, 500, null, true, "Server error")
    }
})

router.post("/update-password", async (req, res) => {
    try {
        const { email, tempPassword, newPassword } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return sendRes(res, 404, null, true, "User not found")
        }

        const isMatch = await bcrypt.compare(tempPassword, user.password)
        if (!isMatch) {
            return sendRes(res, 400, null, true, "Invalid temporary password")
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        user.isFirstLogin = false

        await user.save()

        sendRes(res, 200, null, false, "Password updated successfully")
    } catch (error) {
        console.error(error)
        sendRes(res, 500, null, true, "Server error")
    }
})

export default router