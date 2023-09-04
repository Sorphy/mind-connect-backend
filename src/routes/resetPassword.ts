import express from 'express'
import { genOtp, otpVerification, resetPassword } from '../controller/resetPassword'

const router = express.Router()

router.post('/forgot-password', genOtp)

router.post('/verify-otp', otpVerification)

router.post('/reset-password', resetPassword)

export default router
