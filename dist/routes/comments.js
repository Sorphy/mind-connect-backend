"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_1 = require("../controller/commentsController");
const auth_1 = require("../middleware/auth");
// const {authenticatedUser} = require("../middleware/index");
// import authenticatedUser from "../middleware/index";
const router = express_1.default.Router();
router.post('/create-comment', auth_1.auth, commentsController_1.createComment);
router.get('/', auth_1.auth, commentsController_1.fetchComments);
router.put('/:id', commentsController_1.likeComment);
// router.delete('/:commentId', auth, deleteComment);
exports.default = router;
