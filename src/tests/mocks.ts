import * as CommentModule from '../model/commentsModel';
// import * as UserModule from '../model/registerModel';
import PostModule from '../model/postModel';
// jest.mock("../model/commentsModel")
// jest.mock("../model/postModel")

const comment1 = { id: '1', postId: '123', comment: 'Hello' };
const comment2 = { id: '2', postId: '123', comment: 'Hi' };

const commentMock = jest.fn().mockImplementation(() => {
  return {
    findAll: jest.fn().mockResolvedValue([comment1, comment2]),
    create: (newComment: any) => {
      return Promise.resolve(newComment);
    },
    belongsTo: jest.fn(),
  };
});

// var userMock = jest.fn();

// var postMock = jest.fn().mockImplementation(() => {
//   return {
//     increment: () => {},
//     findOne: () => {},
//     belongsTo: () => {},
//   };
// });
jest.mock("sequelize")
jest.spyOn(PostModule, 'findOne').mockImplementation(jest.fn().mockResolvedValue(true));
// jest.spyOn(CommentModule, 'default').mockImplementation(commentMock)
