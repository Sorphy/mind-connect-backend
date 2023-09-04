"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticatedUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const jwtSecret = process.env.JWT_SECRET_KEY;
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = { id: decodedToken.id }; // Set the 'id' property on req.user
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticatedUser = authenticatedUser;
