"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../controller/post");
const auth_1 = require("../middleware/auth");
const blockAccount_1 = __importDefault(require("../controller/blockAccount"));
const router = express_1.default.Router();
router.post('/create-post', auth_1.auth, post_1.createPost);
router.put('/like-post/:id', auth_1.auth, post_1.likePost);
router.get('/all', post_1.fetchAllPosts);
router.get('/userId', auth_1.auth, post_1.fetchPostsByUser);
router.patch('/block/:id', auth_1.auth, blockAccount_1.default);
router.put('/toggle-visibility/:postId', auth_1.auth, post_1.togglePostVisibility);
router.put('/updatePost/:id', post_1.updatePost);
router.delete('/deletePost/:id', post_1.deletePost);
exports.default = router;
