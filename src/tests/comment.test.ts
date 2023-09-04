require('./mocks');
import { fetchComments, createComment } from '../controller/commentsController';
import Comment from '../model/commentsModel';
import { Request, Response } from 'express';
import Post from '../model/postModel';

const fetchCommentReq = {
  query: {
    postId: '1',
    pageNumber: 1,
    pageSize: 1,
  },
} as unknown as Request;

const fetchCommentReq2 = {
  query: {
    postId: '2',
    pageNumber: 2,
    pageSize: 2,
  },
} as unknown as Request;

const createCommentReq = {
  user: { id: '1' },
  body: {
    postId: '1',
    comment: 'This is a comment',
  },
} as unknown as Request;

const res = {
  json: (input: any) => {
    return JSON.stringify(input);
  },
  status: ()=>{
    return {
      json: ()=>{}
    }
  }
} as unknown as Response;

describe('fetch comments unit tests', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });
  it(' should call Comment.findAll once ', async () => {
    await fetchComments(fetchCommentReq2, res);
    expect(Comment.findAll).toHaveBeenCalledTimes(1);
    expect(Comment.findAll).toBeCalledWith({
      where: {
        post_id: fetchCommentReq2.query.postId,
      },
      limit: fetchCommentReq2.query.pageSize,
      offset: fetchCommentReq2.query.pageNumber,
      include: expect.any(Object),
    });
  });
  it(' should fetch with the proper arguments ', async () => {
    await fetchComments(fetchCommentReq, res);
    expect(Comment.findAll).toHaveBeenCalled();
    expect(Comment.findAll).toBeCalledWith({
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
    await createComment(createCommentReq, res);
    // console.log(Post.findOne.)
    expect(Post.findOne).toBeCalledWith({
      where: {
        id: createCommentReq.body.postId,
      },
    });
    expect(Comment.create).toBeCalledWith({
      id: '1',
      post_id: createCommentReq.body.postId,
      // @ts-ignore
      user_id: createCommentReq.user?.id,
      comment: createCommentReq.body.comment,
    });
    expect(Post.increment).toBeCalledWith('comment', { by: 1, where: { id: createCommentReq.body.postId } });
  });
});
