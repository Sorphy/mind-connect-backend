"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordResetToken = exports.generatePasswordResetToken = exports.sendResetPasswordOTP = exports.sendVerificationOTP = exports.generateOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, otp_expiry };
};
exports.generateOtp = generateOtp;
const sendVerificationOTP = async (email, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.smtp_host,
            port: 587,
            auth: {
                user: process.env.sendinblue_user,
                pass: process.env.sendinblue_pass,
            },
        });
        const mailOptions = {
            from: 'Mind-Connect <noreply@mindconnect-mails.com>',
            to: email,
            subject: 'Account Verification OTP',
            html: `
        <p>Your OTP to verify your account is:</p>
        <h1>${otp}</h1>
        <p>Please enter this OTP to verify your account.</p>
        <p>Note that the OTP is only valid for 30 minutes.</p>
      `,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error(error);
        throw new Error('Error sending account verification OTP');
    }
};
exports.sendVerificationOTP = sendVerificationOTP;
const sendResetPasswordOTP = async (email, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.smtp_host,
            port: 587,
            auth: {
                user: process.env.sendinblue_user,
                pass: process.env.sendinblue_pass,
            },
        });
        const mailOptions = {
            from: 'Mind-Connect <noreply@mindconnect-mails.com>',
            to: email,
            subject: 'Password Reset OTP',
            html: `
        <p>Your OTP to reset your password is:</p>
        <h1>${otp}</h1>
        <p>Please enter this OTP to reset your password.</p>
        <p>Note that this OTP is valid for 30 minutes.</p>
        <p>If you did not make this request, kindly ignore this email.</p>
      `,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error(error);
        throw new Error('Error sending password reset OTP');
    }
};
exports.sendResetPasswordOTP = sendResetPasswordOTP;
const generatePasswordResetToken = async (email, res) => {
    const payload = {
        email: email,
    };
    try {
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '30min' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
        });
        return token;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error generating password reset token');
    }
};
exports.generatePasswordResetToken = generatePasswordResetToken;
const validatePasswordResetToken = (token) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const otp_expiry = new Date(decodedToken.otp_expiry);
        if (otp_expiry.getTime() < new Date().getTime()) {
            return false;
        }
        console.log(decodedToken);
        return decodedToken;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
exports.validatePasswordResetToken = validatePasswordResetToken;
