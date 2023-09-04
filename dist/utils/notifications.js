"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = require("../config/mail");
//Email notification
let transport = nodemailer_1.default.createTransport({
    host: mail_1.SENDINBLUE_HOST,
    auth: {
        user: mail_1.SENDINBLUE_USER,
        pass: mail_1.SENDINBLUE_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendEmail = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: mail_1.FROM_ADMIN_MAIL,
            to,
            subject: mail_1.USER_SUBJECT,
            html
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.sendEmail = sendEmail;
