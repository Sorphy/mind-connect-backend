"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeComment = exports.fetchComments = exports.createComment = void 0;
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const uuid_1 = require("uuid");
const postModel_1 = __importDefault(require("../model/postModel"));
const registerModel_1 = __importDefault(require("../model/registerModel"));
const utils_1 = require("../utils/utils");
const createComment = async (req, res) => {
    try {
        const id = (0, uuid_1.v4)();
        const validateResult = utils_1.createCommentSchema.validate(req.body);
        if (validateResult.error) {
            return res.status(400).json({ Error: validateResult.error.details[0].message });
        }
        const userId = req.user.id;
        const { postId, comment } = req.body;
        const post = await postModel_1.default.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            return res.status(400).json({ message: "post does not exist" });
        }
        const newComment = await commentsModel_1.default.create({
            id,
            post_id: postId,
            user_id: userId,
            comment,
            like: [],
        });
        await postModel_1.default.increment('comment', { by: 1, where: { id: postId } });
        res.status(201).json({ comment: newComment });
    }
    catch (err) {
        console.error('Error creating comment', err);
        res.status(500).json({ Error: 'Failed to create comment' });
    }
};
exports.createComment = createComment;
const fetchComments = async (req, res) => {
    try {
        const { postId, pageNumber, pageSize } = req.query;
        const comments = await commentsModel_1.default.findAll({
            where: {
                post_id: postId,
            },
            limit: pageSize,
            offset: pageNumber,
            include: {
                model: registerModel_1.default,
                attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
            },
        });
        res.json({ comments });
    }
    catch (err) {
        console.error('Error fetching comments', err);
        res.status(500).json({ Error: 'Failed to fetch comments' });
    }
};
exports.fetchComments = fetchComments;
const likeComment = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const likedComment = await commentsModel_1.default.findOne({ where: { id: id } });
        if (!likedComment) {
            return res.status(400).json({ message: 'Comment not found' });
        }
        const likeArr = [...likedComment.like];
        let updatedLikeArr;
        if (likeArr.includes(userId)) {
            updatedLikeArr = likeArr.filter((item) => item !== userId);
        }
        else {
            updatedLikeArr = [...likeArr, userId];
        }
        await likedComment.update({ like: [...updatedLikeArr] });
        return res.status(200).json({ likedComment });
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.likeComment = likeComment;
// export const deleteComment = async (req: JwtPayload, res: Response) => {
//     const {commentId} = req.params;
//     const userId = req.user.id
//     console.log(commentId);
//     console.log(userId);
//     const comment:Comment | any = await Comment.findOne({
//         where: {
//             id: commentId,
//             user_id: userId
//         }
//     })
//     if(comment){
//         Comment.destroy({
//             where: {
//                 id: commentId,
//                 user_id: userId
//             }
//         })
//         await Post.decrement('comment', { by: 1, where: { id: comment.post_id }});
//         res.status(201).json({message: "comment deleted successfully"});
//     } else {
//         res.status(400).json({Error: 'cannot  delete comment'})
//     }
// }
