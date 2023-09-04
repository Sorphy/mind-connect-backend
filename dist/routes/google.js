"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleAuth_1 = require("../controller/googleAuth");
const googleauth_1 = require("../utils/googleauth");
const router = express_1.default.Router();
router.get(`/google/url`, (req, res) => {
    res.redirect(`${(0, googleauth_1.getGoogleAuthURL)()}`);
});
router.get(`/google`, googleAuth_1.googleSignIn);
exports.default = router;
