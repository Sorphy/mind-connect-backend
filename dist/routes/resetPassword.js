"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resetPassword_1 = require("../controller/resetPassword");
const router = express_1.default.Router();
router.post('/forgot-password', resetPassword_1.genOtp);
router.post('/verify-otp', resetPassword_1.otpVerification);
router.post('/reset-password', resetPassword_1.resetPassword);
exports.default = router;
