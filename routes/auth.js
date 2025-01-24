import express from "express";
import Joi from "joi";
import 'dotenv/config'
import sendRes from "../helper/sendRes.js";
import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router();

const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

router.post('/signup', async (req, res) => {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return sendRes(res, 400, null, true, error.message);
    const user = await User.findOne({ email: value.email }).lean()
    if (user) return sendRes(res, 403, null, true, 'User already exists.');

    const hashedPassword = await bcrypt.hash(value.password, 10)
    value.password = hashedPassword;
    let newUser = new User({ ...value });
    newUser = await newUser.save();

    sendRes(res, 201, newUser, false, 'User created succesfully!')
})

router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return sendRes(res, 400, null, true, error.message);
    const user = await User.findOne({ email: value.email }).lean();
    if (!user) return sendRes(res, 403, null, true, 'User not exists');

    const passwordChecker = await bcrypt.compare(value.password, user.password);
    if (!passwordChecker) return sendRes(res, 403, null, true, 'Wrong Password or Email');
    delete user.password

    var token = jwt.sign({ ...user }, process.env.AUTH_SECRET);

    sendRes(res, 200, { user, token }, false, 'User logged in!')
})

export default router