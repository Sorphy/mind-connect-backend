import express, { Response, Request } from 'express';

import {
  createPost,
  fetchAllPosts,
  fetchPostsByUser,
//   likePost,
  togglePostVisibility,
  updatePost,
  deletePost,
} from '../controller/post';

import { auth } from '../middleware/auth';
import blockAccountFromPost from '../controller/blockAccount';

const router = express.Router();

router.post('/create-post', auth, createPost);

// router.put('/like-post/:id', auth, likePost);

router.get('/all', fetchAllPosts);
router.get('/userId', auth, fetchPostsByUser);

router.patch('/block/:id', auth, blockAccountFromPost);
router.put('/toggle-visibility/:postId', auth, togglePostVisibility);
router.put('/updatePost/:id', updatePost);
router.delete('/deletePost/:id', deletePost);

export default router;
