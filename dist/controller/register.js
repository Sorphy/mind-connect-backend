"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.verifyOTP = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerModel_1 = __importDefault(require("../model/registerModel"));
const uuid_1 = require("uuid");
const resetPassword_1 = require("../utils/resetPassword");
const register = async (req, res) => {
    const { firstName, lastName, email, mentalCondition, country, state, gender, password, confirmPassword, } = req.body;
    if (password !== confirmPassword) {
        return res.status(404).send('Password does not match');
    }
    try {
        const userExist = await registerModel_1.default.findOne({ where: { email } });
        if (userExist) {
            return res.status(404).send('This User already exists');
        }
        const encryptedPassword = await bcryptjs_1.default.hash(password, 10);
        const { otp, otp_expiry } = (0, resetPassword_1.generateOtp)();
        const newUser = await registerModel_1.default.create({
            id: (0, uuid_1.v4)(),
            firstName,
            lastName,
            email,
            mentalCondition,
            country,
            state,
            gender,
            password: encryptedPassword,
            otp,
            otp_expiry,
            verify: false,
            blocked: [],
            profilePhoto: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email }, process.env.JWT_SECRET_KEY || 'SECRET-KEY', {
            expiresIn: '7d',
        });
        await (0, resetPassword_1.sendVerificationOTP)(newUser.email, newUser.otp);
        return res.status(201).json({
            userDetails: newUser,
            token
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send('An error occurred, please try again');
    }
};
exports.register = register;
const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await registerModel_1.default.findOne({ where: { otp } });
        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }
        if (user.verify) {
            return res.status(400).json({ Error: 'User already verified' });
        }
        const currentTime = new Date();
        if (currentTime > user.otp_expiry) {
            return res.status(400).json({ Error: 'OTP has expired' });
        }
        // Update user verification status
        user.verify = true;
        await user.save();
        return res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ Error: 'An error occurred, please try again' });
    }
};
exports.verifyOTP = verifyOTP;
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await registerModel_1.default.findAll();
        console.log(allUsers);
        if (!allUsers) {
            return res.status(404).json({ Error: 'No Users found' });
        }
        return res.status(200).json({ allUsers });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.getAllUsers = getAllUsers;
