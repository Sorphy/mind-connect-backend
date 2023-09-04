"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.createCommentSchema = exports.updatePostSchema = exports.createPostSchema = exports.loginUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().trim().lowercase().required(),
    password: joi_1.default.string().trim().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});
exports.createPostSchema = joi_1.default.object().keys({
    postContent: joi_1.default.string().allow('').optional(),
    image: joi_1.default.array().items(joi_1.default.string()).optional(),
    video: joi_1.default.array().items(joi_1.default.string()).allow('').optional(),
    file: joi_1.default.array().items(joi_1.default.string()).allow('').optional(),
    groupId: joi_1.default.string().allow('').optional(),
});
exports.updatePostSchema = joi_1.default.object().keys({
    postContent: joi_1.default.string().required()
});
exports.createCommentSchema = joi_1.default.object().keys({
    postId: joi_1.default.string().required(),
    comment: joi_1.default.string().required(),
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
