import Post, { PostAttributes } from '../model/postModel';
import User from '../model/registerModel';
import { Request, Response } from 'express';

const blockAccountFromPost = async (req: Request | any, res: Response) => {
  try {
    const blockerid = req.user.id;
    const { id } = req.params;

    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = post.userId;

    const blocker = await User.findOne({ where: { id: blockerid } });
    if (!blocker) {
      return res.status(404).json({ message: "Blocker not found" });
    }

    const array = blocker.blocked || [];
    array.push(userId);

    await blocker.update({ blocked: array });

    return res
      .status(200)
      .json({ message: "User blocked successfully", updatedblocker: blocker });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default blockAccountFromPost;
