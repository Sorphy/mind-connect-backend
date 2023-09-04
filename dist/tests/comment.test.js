"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('./mocks');
const commentsController_1 = require("../controller/commentsController");
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const fetchCommentReq = {
    query: {
        postId: '1',
        pageNumber: 1,
        pageSize: 1,
    },
};
const fetchCommentReq2 = {
    query: {
        postId: '2',
        pageNumber: 2,
        pageSize: 2,
    },
};
const createCommentReq = {
    user: { id: '1' },
    body: {
        postId: '1',
        comment: 'This is a comment',
    },
};
const res = {
    json: (input) => {
        return JSON.stringify(input);
    },
    status: () => {
        return {
            json: () => { }
        };
    }
};
describe('fetch comments unit tests', () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });
    it(' should call Comment.findAll once ', async () => {
        await (0, commentsController_1.fetchComments)(fetchCommentReq2, res);
        expect(commentsModel_1.default.findAll).toHaveBeenCalledTimes(1);
        expect(commentsModel_1.default.findAll).toBeCalledWith({
            where: {
                post_id: fetchCommentReq2.query.postId,
            },
            limit: fetchCommentReq2.query.pageSize,
            offset: fetchCommentReq2.query.pageNumber,
            include: expect.any(Object),
        });
    });
    it(' should fetch with the proper arguments ', async () => {
        await (0, commentsController_1.fetchComments)(fetchCommentReq, res);
        expect(commentsModel_1.default.findAll).toHaveBeenCalled();
        expect(commentsModel_1.default.findAll).toBeCalledWith({
            where: {
                post_id: fetchCommentReq.query.postId,
            },
            limit: fetchCommentReq.query.pageSize,
            offset: fetchCommentReq.query.pageNumber,
            include: expect.any(Object),
        });
    });
});
describe(' create comment unit', () => {
    it(' should create a comment', async () => {
        await (0, commentsController_1.createComment)(createCommentReq, res);
        // console.log(Post.findOne.)
        expect(postModel_1.default.findOne).toBeCalledWith({
            where: {
                id: createCommentReq.body.postId,
            },
        });
        expect(commentsModel_1.default.create).toBeCalledWith({
            id: '1',
            post_id: createCommentReq.body.postId,
            // @ts-ignore
            user_id: createCommentReq.user?.id,
            comment: createCommentReq.body.comment,
        });
        expect(postModel_1.default.increment).toBeCalledWith('comment', { by: 1, where: { id: createCommentReq.body.postId } });
    });
});
