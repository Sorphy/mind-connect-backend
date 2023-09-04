"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    mentalCondition: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    gender: Joi.string().required(),
    password: Joi.string().min(4).max(100).required(),
    confirmPassword: Joi.string().min(4).max(100).required(),
    blocked: Joi.array().items(Joi.string())
});
exports.default = registerSchema;
