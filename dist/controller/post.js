"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.fetchPostsByUser = exports.fetchAllPosts = exports.togglePostVisibility = exports.likePost = exports.createPost = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const postModel_1 = __importDefault(require("../model/postModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("../middleware/cloudinary"); // Assuming you export the functions from the file where you defined them
const registerModel_1 = __importDefault(require("../model/registerModel"));
const sequelize_1 = require("sequelize");
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const createPost = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ Error: 'Unauthorized' });
        }
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (!verified) {
            return res.status(401).json({ Error: 'Token not valid' });
        }
        const id = (0, uuid_1.v4)();
        const validateResult = utils_1.createPostSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({ Error: validateResult.error.details[0].message });
        }
        const userId = verified.id;
        const { groupId, ...postData } = req.body;
        if (!Array.isArray(postData.image)) {
            postData.image = [];
        }
        if (!Array.isArray(postData.video)) {
            postData.video = [];
        }
        if (!Array.isArray(postData.file)) {
            postData.file = [];
        }
        postData.userId = userId;
        postData.groupId = groupId;
        if (req.files) {
            const files = req.files;
            if (files.image && Array.isArray(files.image)) {
                for (const img of files.image) {
                    const imagePath = img.path; // Get the file path
                    const uploadResult = await (0, cloudinary_1.uploadFile)(imagePath, id, 'image');
                    if (uploadResult.secure_url) {
                        postData.image.push(uploadResult.secure_url);
                    }
                    else {
                        return res.status(400).json({ Error: 'Error uploading the image' });
                    }
                }
            }
            if (files.video && Array.isArray(files.video)) {
                for (const vid of files.video) {
                    const videoPath = vid.path; // Get the file path
                    const uploadResult = await (0, cloudinary_1.uploadFile)(videoPath, id, 'video');
                    if (uploadResult.secure_url) {
                        postData.video.push(uploadResult.secure_url);
                    }
                    else {
                        return res.status(400).json({ Error: 'Error uploading the video' });
                    }
                }
            }
            if (files.file && Array.isArray(files.file)) {
                for (const f of files.file) {
                    const filePath = f.path; // Get the file path
                    const uploadResult = await (0, cloudinary_1.uploadFile)(filePath, id, 'file');
                    if (uploadResult.secure_url) {
                        postData.file.push(uploadResult.secure_url);
                    }
                    else {
                        return res.status(400).json({ Error: 'Error uploading the file' });
                    }
                }
            }
        }
        try {
            const newPost = await postModel_1.default.create(postData);
            return res.status(201).json(newPost);
        }
        catch (error) {
            console.error('Failed to create the post:', error);
            return res.status(500).json({ Error: 'Failed to create the post' });
        }
    }
    catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
};
exports.createPost = createPost;
const likePost = async (req, res) => {
    try {
        const postId = req.body.postId;
        const groupId = req.body.groupId;
        const userId = req.user?.id;
        console.log('postId:', postId);
        const whereCondition = { id: postId };
        if (groupId) {
            whereCondition['groupId'] = groupId;
        }
        const postToLike = await postModel_1.default.findOne({
            where: whereCondition,
            include: { model: registerModel_1.default, as: 'User' },
        });
        console.log('postToLike:', postToLike);
        if (!postToLike) {
            console.log('Post not found', postId);
            return res.status(404).json({
                error: 'Invalid postId',
            });
        }
        const likeArr = postToLike.like;
        const liked = likeArr.includes(userId);
        let updatedLikeArr;
        if (liked) {
            updatedLikeArr = likeArr.filter((item) => item !== userId);
        }
        else {
            updatedLikeArr = [...likeArr, userId];
        }
        await postToLike.update({
            like: updatedLikeArr,
        });
        const numberOfLikes = updatedLikeArr.length;
        const isLiked = updatedLikeArr.includes(userId);
        const message = isLiked ? 'You have liked this post' : 'You have unliked the post';
        return res.status(200).json({
            message,
            numberOfLikes,
            liked: isLiked,
            likedPost: postToLike,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.likePost = likePost;
const togglePostVisibility = async (req, res) => {
    try {
        const { postId } = req.params;
        const groupId = req.query.groupId;
        // Find the post by postId and groupId (if provided)
        const post = await postModel_1.default.findOne({
            where: {
                id: postId,
                groupId: groupId ? { [sequelize_1.Op.eq]: groupId } : null,
            },
        });
        if (!post) {
            return res.status(404).json({ Error: 'Post not found' });
        }
        // Toggle the visibility
        post.visible = !post.visible;
        // Save the changes
        await post.save();
        return res.status(200).json({
            msg: 'Post visibility toggled successfully.',
            post,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
};
exports.togglePostVisibility = togglePostVisibility;
const fetchAllPosts = async (req, res) => {
    try {
        const { groupId } = req.query;
        let posts;
        if (groupId) {
            posts = await postModel_1.default.findAll({
                where: {
                    groupId: groupId,
                    visible: true,
                },
                include: {
                    model: registerModel_1.default,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
                },
            });
        }
        else {
            posts = await postModel_1.default.findAll({
                where: {
                    visible: true,
                },
                include: {
                    model: registerModel_1.default,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
                },
            });
        }
        posts = posts.filter((post) => post.visible === true);
        if (posts.length === 0) {
            return res.status(404).json({
                msg: 'No posts found',
            });
        }
        return res.status(200).json({
            msg: 'You have successfully retrieved all posts',
            posts,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'An error occurred while retrieving the posts',
        });
    }
};
exports.fetchAllPosts = fetchAllPosts;
const fetchPostsByUser = async (req, res) => {
    try {
        const verified = req.user;
        const { groupId } = req.query;
        let posts;
        if (groupId) {
            posts = await postModel_1.default.findAll({
                where: { userId: verified.id, groupId },
                include: {
                    model: registerModel_1.default,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
                },
            });
        }
        else {
            posts = await postModel_1.default.findAll({
                where: { userId: verified.id },
                include: {
                    model: registerModel_1.default,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
                },
            });
        }
        return res.status(200).json({
            msg: 'Posts retrieved successfully',
            posts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};
exports.fetchPostsByUser = fetchPostsByUser;
//=================DELETE POST=========================//
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const groupId = req.query.groupId;
        const post = groupId
            ? await postModel_1.default.findOne({ where: { id: postId, groupId: groupId } }) // Delete group post
            : await postModel_1.default.findByPk(postId); // Delete general post
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Delete associated comments
        await commentsModel_1.default.destroy({ where: { post_id: post.id } });
        // Delete the post
        await post.destroy();
        return res.status(200).json({ message: 'Post and associated comments deleted successfully' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deletePost = deletePost;
//==========================UPDATE POST===============================//
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const groupId = req.query.groupId;
        const updatedData = req.body;
        const post = await postModel_1.default.findOne({ where: { id: postId, groupId: groupId || null } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Convert image, video, file fields to arrays
        const { image, video, file } = updatedData;
        updatedData.image = image ? [image] : [];
        updatedData.video = video ? [video] : [];
        updatedData.file = file ? [file] : [];
        // Update the post data
        await post.update(updatedData, {
            fields: ['postContent', 'image', 'video', 'file', 'visible'],
        });
        // Check for updated image, video, or file
        if (image) {
            // Upload and update the image
            const uploadResult = await (0, cloudinary_1.uploadFile)(image, postId, 'image');
            if (uploadResult.secure_url) {
                post.image = [uploadResult.secure_url];
            }
        }
        if (video) {
            // Upload and update the video
            const uploadResult = await (0, cloudinary_1.uploadFile)(video, postId, 'video');
            if (uploadResult.secure_url) {
                post.video = [uploadResult.secure_url];
            }
        }
        if (file) {
            // Upload and update the file
            const uploadResult = await (0, cloudinary_1.uploadFile)(file, postId, 'file');
            if (uploadResult.secure_url) {
                post.file = [uploadResult.secure_url];
            }
        }
        // Save the updated post with image, video, or file changes
        await post.save();
        // Fetch the updated post
        const updatedPost = await postModel_1.default.findByPk(postId);
        return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.updatePost = updatePost;
