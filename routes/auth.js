import express from "express";
import Joi from "joi";
import 'dotenv/config'
import sendRes from "../helper/sendRes.js";
import User from "../models/user.js";

const router = express.Router();

const signupSchema = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
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
})

router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return sendRes(res, 400, null, true, error.message);
})

export default router