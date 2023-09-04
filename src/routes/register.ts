import express from "express";
import { getAllUsers, register, verifyOTP } from '../controller/register';
import registerSchema from "../utils/registerValidation";
import { Login } from '../controller/login';

const validator = require("express-joi-validation").createValidator({});
const router = express.Router();

router.post('/register', validator.body(registerSchema), register);
router.post('/verify-user', verifyOTP);
router.get('/allUsers', getAllUsers);

router.post('/login', Login);


export default router;

