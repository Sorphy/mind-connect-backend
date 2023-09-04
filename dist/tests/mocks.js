"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as UserModule from '../model/registerModel';
const postModel_1 = __importDefault(require("../model/postModel"));
// jest.mock("../model/commentsModel")
// jest.mock("../model/postModel")
const comment1 = { id: '1', postId: '123', comment: 'Hello' };
const comment2 = { id: '2', postId: '123', comment: 'Hi' };
const commentMock = jest.fn().mockImplementation(() => {
    return {
        findAll: jest.fn().mockResolvedValue([comment1, comment2]),
        create: (newComment) => {
            return Promise.resolve(newComment);
        },
        belongsTo: jest.fn(),
    };
});
// var userMock = jest.fn();
// var postMock = jest.fn().mockImplementation(() => {
//   return {
//     increment: () => {},
//     findOne: () => {},
//     belongsTo: () => {},
//   };
// });
jest.mock("sequelize");
jest.spyOn(postModel_1.default, 'findOne').mockImplementation(jest.fn().mockResolvedValue(true));
// jest.spyOn(CommentModule, 'default').mockImplementation(commentMock)
