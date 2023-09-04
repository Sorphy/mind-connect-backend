"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_SUBJECT = exports.FROM_ADMIN_MAIL = exports.SENDINBLUE_HOST = exports.SENDINBLUE_PASSWORD = exports.SENDINBLUE_USER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SENDINBLUE_USER = process.env.SENDINBLUE_USER;
exports.SENDINBLUE_PASSWORD = process.env.SENDINBLUE_PASSWORD;
exports.SENDINBLUE_HOST = process.env.SENDINBLUE_HOST;
exports.FROM_ADMIN_MAIL = process.env.FROM_ADMIN_MAIL;
exports.USER_SUBJECT = process.env.USER_SUBJECT;
