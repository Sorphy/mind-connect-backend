"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSignIn = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleauth_1 = require("../utils/googleauth");
const registerModel_1 = __importDefault(require("../model/registerModel"));
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const port = 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const googleSignIn = async (req, res) => {
    try {
        const code = req.query.code;
        const { id_token, access_token } = await (0, googleauth_1.getTokens)({
            code,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            redirectUri: `http://localhost:${port}/auth/google`,
        });
        // Fetch the user's profile with the access token and bearer
        const googleUser = await axios_1.default
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        })
            .then((res) => res.data)
            .catch((error) => {
            console.error(`Failed to fetch user`);
            throw new Error(error.message);
        });
        const user = await registerModel_1.default.findOne({ where: { email: googleUser.email } });
        if (!user) {
            const newUser = await registerModel_1.default.create({
                id: googleUser.id,
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                email: googleUser.email,
                mentalCondition: "",
                country: "",
                state: "",
                password: "",
                gender: "",
                otp: null,
                otp_expiry: null,
                blocked: [],
                profilePhoto: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
                // verify: true
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET_KEY, { expiresIn: '30d' });
            res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            //  return res.status(200).json({ message: 'User registered successfully' });
            res.redirect("http://localhost:5173/dashboard");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
};
exports.googleSignIn = googleSignIn;
