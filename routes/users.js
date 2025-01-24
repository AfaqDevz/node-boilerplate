import express from "express";
import User from "../models/user.js";
import sendRes from "../helper/sendRes.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const allUsers = await User.find()

    sendRes(res, 201, allUsers, false, 'All Users found!');
})

router.get('/:username', async (req, res) => {
    const findUsername = await User.findOne({ username: req.params.username });

    if (!findUsername) {
        return sendRes(res, 404, null, true, 'User not found!')
    }

    sendRes(res, 201, findUsername, false, 'User found!')
})

export default router