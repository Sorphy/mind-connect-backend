"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.otpVerification = exports.genOtp = void 0;
const registerModel_1 = __importDefault(require("../model/registerModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const resetPassword_1 = require("../utils/resetPassword");
const genOtp = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await registerModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                message: 'Invalid user, kindly register first',
            });
        }
        const { otp, otp_expiry } = (0, resetPassword_1.generateOtp)(); // Generate a new OTP
        const token = await (0, resetPassword_1.generatePasswordResetToken)(email, res);
        await (0, resetPassword_1.sendResetPasswordOTP)(email, otp);
        // Update user's OTP and OTP expiry
        user.otp = otp;
        user.otp_expiry = otp_expiry;
        await user.save();
        return res.status(200).json({ message: 'OTP sent successfully', token, otp });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.genOtp = genOtp;
//   export const otpVerification = async (req: Request, res: Response) => {
//     const { otp } = req.body;
//     try {
//       const token = req.cookies.token;
//       if (!token) {
//         return res.status(400).json({ error: 'Token not found' });
//       }
//       const isValidToken = validatePasswordResetToken(token);
//       if (!isValidToken) {
//         return res.status(400).json({ error: 'Invalid or expired token' });
//       }
//       const decodedToken: any = jwt.decode(token);
//       const { email } = decodedToken;
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       if (otp !== user.otp) {
//         return res.status(400).json({ error: 'Invalid OTP' });
//       }
//       // Check if OTP has expired
//       const currentTime = new Date();
//       if (currentTime > user.otp_expiry) {
//         return res.status(400).json({ error: 'OTP has expired' });
//       }
//       return res.status(200).json({
//         message: 'OTP verified successfully',
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
const otpVerification = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await registerModel_1.default.findOne({ where: { otp } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if OTP has expired
        const currentTime = new Date();
        if (currentTime > user.otp_expiry) {
            return res.status(400).json({ error: 'OTP has expired' });
        }
        return res.status(200).json({
            message: 'OTP verified successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.otpVerification = otpVerification;
const resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ error: 'Token not found' });
        }
        const isValidToken = (0, resetPassword_1.validatePasswordResetToken)(token);
        if (!isValidToken) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const { email } = isValidToken;
        const user = await registerModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords must match' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 8);
        await user.update({ password: hashedPassword });
        return res.status(200).json({
            message: 'Password reset successfully',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.resetPassword = resetPassword;
