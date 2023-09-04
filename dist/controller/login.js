"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils/utils");
const registerModel_1 = __importDefault(require("../model/registerModel"));
const jwtSecret = process.env.JWT_SECRET_KEY;
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate with Joi
        const validateResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({ Error: validateResult.error.details[0].message });
        }
        // Find user in database
        const user = await registerModel_1.default.findOne({
            where: { email: email },
        });
        // Check if user exists and password is correct
        if (!user) {
            return res.status(400).json({ Error: 'User does not exist' });
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ Error: 'Invalid email or password' });
        }
        // Check if user is verified
        if (!user.verify) {
            return res.status(401).json({ Error: 'User not verified' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, jwtSecret, { expiresIn: '30d' });
        return res.status(200).json({
            msg: 'User logged in successfully',
            user,
            token,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ Error: 'Something went wrong' });
    }
};
exports.Login = Login;
