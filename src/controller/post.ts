import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createPostSchema, updatePostSchema, options } from '../utils/utils';
import Post, { PostAttributes } from '../model/postModel';
import jwt, { Secret } from 'jsonwebtoken';
import { uploadFile } from '../middleware/cloudinary'; // Assuming you export the functions from the file where you defined them
import User from '../model/registerModel';
import { Model, Op, WhereAttributeHash } from 'sequelize';
import Comment, { CommentAttributes } from '../model/commentsModel';


export const createPost = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ Error: 'Unauthorized' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

    if (!verified) {
      return res.status(401).json({ Error: 'Token not valid' });
    }

    const id = uuidv4();

    const validateResult = createPostSchema.validate(req.body, options);

    if (validateResult.error) {
      return res.status(400).json({ Error: validateResult.error.details[0].message });
    }

    const userId = (verified as { id: string }).id;

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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.image && Array.isArray(files.image)) {
        for (const img of files.image) {
          const imagePath = img.path; // Get the file path
          const uploadResult = await uploadFile(imagePath, id, 'image');

          if (uploadResult.secure_url) {
            postData.image.push(uploadResult.secure_url);
          } else {
            return res.status(400).json({ Error: 'Error uploading the image' });
          }
        }
      }

      if (files.video && Array.isArray(files.video)) {
        for (const vid of files.video) {
          const videoPath = vid.path; // Get the file path
          const uploadResult = await uploadFile(videoPath, id, 'video');

          if (uploadResult.secure_url) {
            postData.video.push(uploadResult.secure_url);
          } else {
            return res.status(400).json({ Error: 'Error uploading the video' });
          }
        }
      }

      if (files.file && Array.isArray(files.file)) {
        for (const f of files.file) {
          const filePath = f.path; // Get the file path
          const uploadResult = await uploadFile(filePath, id, 'file');

          if (uploadResult.secure_url) {
            postData.file.push(uploadResult.secure_url);
          } else {
            return res.status(400).json({ Error: 'Error uploading the file' });
          }
        }
      }
    }

    try {
      const newPost = await Post.create(postData);
      return res.status(201).json(newPost);
    } catch (error) {
      console.error('Failed to create the post:', error);
      return res.status(500).json({ Error: 'Failed to create the post' });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ Error: 'Internal Server Error' });
  }
};




export const likePost = async (req: Request, res: Response) => {
  try {
    const postId = req.body.postId;
    const groupId = req.body.groupId;
    const userId = (req.user as { id: string })?.id;

    console.log('postId:', postId);

    const whereCondition: any = { id: postId };

    if (groupId) {
      whereCondition['groupId'] = groupId;
    }

    const postToLike = await Post.findOne({
      where: whereCondition,
      include: { model: User, as: 'User' },
    });

    console.log('postToLike:', postToLike);

    if (!postToLike) {
      console.log('Post not found', postId);
      return res.status(404).json({
        error: 'Invalid postId',
      });
    }

    const likeArr = postToLike.like as string[];
    const liked = likeArr.includes(userId as string);

    let updatedLikeArr: string[];

    if (liked) {
      updatedLikeArr = likeArr.filter((item) => item !== userId);
    } else {
      updatedLikeArr = [...likeArr, userId as string];
    }

    await postToLike.update({
      like: updatedLikeArr,
    });

    const numberOfLikes = updatedLikeArr.length;
    const isLiked = updatedLikeArr.includes(userId as string);

    const message = isLiked ? 'You have liked this post' : 'You have unliked the post';

    return res.status(200).json({
      message,
      numberOfLikes,
      liked: isLiked,
      likedPost: postToLike,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const togglePostVisibility = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const groupId = req.query.groupId as string | undefined;

    // Find the post by postId and groupId (if provided)
    const post: Post | null = await Post.findOne({
      where: {
        id: postId,
        groupId: groupId ? ({ [Op.eq]: groupId } as unknown as WhereAttributeHash<string>) : null,
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: 'Internal Server Error' });
  }
};

export const fetchAllPosts = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.query;

    let posts;

    if (groupId) {
      posts = await Post.findAll({
        where: {
          groupId: groupId as string,
          visible: true,
        },
        include: {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
        },
      });
    } else {
      posts = await Post.findAll({
        where: {
          visible: true,
        },
        include: {
          model: User,
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'An error occurred while retrieving the posts',
    });
  }
};


export const fetchPostsByUser = async (req: Request | any, res: Response) => {
  try {
    const verified = req.user;
    const { groupId } = req.query;

    let posts;

    if (groupId) {
      posts = await Post.findAll({
        where: { userId: verified.id, groupId },
        include: {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
        },
      });
    } else {
      posts = await Post.findAll({
        where: { userId: verified.id },
        include: {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto'],
        },
      });
    }

    return res.status(200).json({
      msg: 'Posts retrieved successfully',
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
};

//=================DELETE POST=========================//

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
const groupId = req.query.groupId as string;

const post = groupId
  ? await Post.findOne({ where: { id: postId, groupId: groupId } }) // Delete group post
  : await Post.findByPk(postId); // Delete general post

if (!post) {
  return res.status(404).json({ error: 'Post not found' });
}

// Delete associated comments
await Comment.destroy({ where: { post_id: post.id } });

// Delete the post
await post.destroy();

return res.status(200).json({ message: 'Post and associated comments deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


//==========================UPDATE POST===============================//

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const groupId = req.query.groupId as string;

    const updatedData = req.body;

    const post = await Post.findOne({ where: { id: postId, groupId: groupId || null } });

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
      const uploadResult = await uploadFile(image, postId, 'image');
      if (uploadResult.secure_url) {
        post.image = [uploadResult.secure_url];
      }
    }

    if (video) {
      // Upload and update the video
      const uploadResult = await uploadFile(video, postId, 'video');
      if (uploadResult.secure_url) {
        post.video = [uploadResult.secure_url];
      }
    }

    if (file) {
      // Upload and update the file
      const uploadResult = await uploadFile(file, postId, 'file');
      if (uploadResult.secure_url) {
        post.file = [uploadResult.secure_url];
      }
    }

    // Save the updated post with image, video, or file changes
    await post.save();

    // Fetch the updated post
    const updatedPost = await Post.findByPk(postId);

    return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};