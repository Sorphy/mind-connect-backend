"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postModel_1 = __importDefault(require("../model/postModel"));
const registerModel_1 = __importDefault(require("../model/registerModel"));
const blockAccountFromPost = async (req, res) => {
    try {
        const blockerid = req.user.id;
        const { id } = req.params;
        const post = await postModel_1.default.findOne({ where: { id } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const userId = post.userId;
        const blocker = await registerModel_1.default.findOne({ where: { id: blockerid } });
        if (!blocker) {
            return res.status(404).json({ message: "Blocker not found" });
        }
        const array = blocker.blocked || [];
        array.push(userId);
        await blocker.update({ blocked: array });
        return res
            .status(200)
            .json({ message: "User blocked successfully", updatedblocker: blocker });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.default = blockAccountFromPost;
