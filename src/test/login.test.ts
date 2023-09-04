// // import { Request, Response } from 'express';
// // import dotenv from 'dotenv';
// // import axios from 'axios';
// // import User from '../model/registerModel';
// // import { Login } from '../controller/login';
// // import { mock } from 'jest-mock-extended';
// // const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
// // dotenv.config();

// // describe('Login Endpoint', () => {
// //   let req: Request;
// //   let res: Response;

// //   beforeEach(() => {
// //     req = {
// //       body: {
// //         email: 'test@example.com',
// //         password: 'password123',
// //       },
// //     } as Request;
// //     res = {
// //       status: mock<any>(),
// //       json: mock<any>(),
// //       cookie: mock<any>(),
// //     } as Response;
// //   });

// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });
// //   it('should return status 200 and user data if login is successful', async () => {
// //     const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: true };
// //     const jwtSecret = JWT_SECRET; // Replace with the correct JWT secret

// //     // Mock the necessary functions
// //     const loginUserSchema = {
// //       validate: jest.fn().mockReturnValue({ error: null }),
// //     };
// //     const bcrypt = {
// //       compare: jest.fn().mockResolvedValue(true),
// //     };
// //     const jwt = {
// //       sign: jest.fn().mockReturnValue('token'),
// //     };
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(user),
// //     };
// //     const axios = {
// //       get: jest.fn().mockResolvedValue({ data: { someData: 'value' } }),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(loginUserSchema.validate).toHaveBeenCalledWith(req.body, expect.any(Object));
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
// //     expect(jwt.sign).toHaveBeenCalledWith({ id: user.id }, jwtSecret, { expiresIn: '30d' });
// //     expect(res.cookie).toHaveBeenCalledWith('token', 'token', { httpOnly: true, maxAge: 30 * 60 * 1000 });
// //     expect(axios.get).toHaveBeenCalledWith('https://api.chatengine.io/users/me/', {
// //       headers: {
// //         'Project-ID': expect.any(String),
// //         'User-Name': user.email,
// //         'User-Secret': user.password,
// //       },
// //     });
// //     expect(res.status).toHaveBeenCalledWith(200);
// //     expect(res.json).toHaveBeenCalledWith({
// //       msg: 'User logged in successfully',
// //       user,
// //       token: 'token',
// //       r: { data: { someData: 'value' } },
// //     });
// //   });

// //   it('should return status 400 and error message if email or password is invalid', async () => {
// //     const validateResult = { error: { details: [{ message: 'Invalid email' }] } };
// //     const loginUserSchema = {
// //       validate: jest.fn().mockReturnValue(validateResult),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(loginUserSchema.validate).toHaveBeenCalledWith(req.body, expect.any(Object));
// //     expect(res.status).toHaveBeenCalledWith(400);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'Invalid email' });
// //   });

// //   it('should return status 400 and error message if user does not exist', async () => {
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(null),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(res.status).toHaveBeenCalledWith(400);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'User does not exist' });
// //   });

// //   it('should return status 400 and error message if password is invalid', async () => {
// //     const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: true };
// //     const bcrypt = {
// //       compare: jest.fn().mockResolvedValue(false),
// //     };
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(user),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
// //     expect(res.status).toHaveBeenCalledWith(400);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'Invalid email or password' });
// //   });

// //   it('should return status 401 and error message if user is not verified', async () => {
// //     const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: false };
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(user),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(res.status).toHaveBeenCalledWith(401);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'User not verified' });
// //   });

// //   it('should return status 500 and error message if an error occurs', async () => {
// //     const error = new Error('Something went wrong');
// //     console.error = jest.fn(); // Mock console.error to prevent it from printing the error during testing

// //     // Mock the necessary functions to throw an error
// //     const loginUserSchema = {
// //       validate: jest.fn().mockReturnValue({ error }),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(loginUserSchema.validate).toHaveBeenCalledWith(req.body, expect.any(Object));
// //     expect(res.status).toHaveBeenCalledWith(500);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'Something went wrong' });
// //     expect(console.error).toHaveBeenCalledWith(error);
// //   });
// // });

// // import { Login } from '../controller/login';
// // import jest from 'jest';
// // import { Request, Response } from 'express';
// // import dotenv from 'dotenv';
// // dotenv.config()

// // const JWT_SECRET = process.env.JWT_SECRET_KEY as string

// //   beforeEach(() => {
// //     req = {
// //       body: {
// //         email: 'test@example.com',
// //         password: 'password123',
// //       },
// //     } as Request;
// //     res = {
// //       status: jest.fn().mockReturnThis(),
// //       json: jest.fn(),
// //       cookie: jest.fn(),
// //     } as Response;
// //   });

// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   it('should return status 200 and user data if login is successful', async () => {
// //     const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: true };
// //     const jwtSecret = JWT_SECRET;

// //     // Mock the necessary functions
// //     const loginUserSchema = {
// //       validate: jest.fn().mockReturnValue({ error: null }),
// //     };
// //     const bcrypt = {
// //       compare: jest.fn().mockResolvedValue(true),
// //     };
// //     const jwt = {
// //       sign: jest.fn().mockReturnValue('token'),
// //     };
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(user),
// //     };
// //     const axios = {
// //       get: jest.fn().mockResolvedValue({ data: { someData: 'value' } }),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(loginUserSchema.validate).toHaveBeenCalledWith(req.body, expect.any(Object));
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
// //     expect(jwt.sign).toHaveBeenCalledWith({ id: user.id }, jwtSecret, { expiresIn: '30d' });
// //     expect(res.cookie).toHaveBeenCalledWith('token', 'token', { httpOnly: true, maxAge: 30 * 60 * 1000 });
// //     expect(axios.get).toHaveBeenCalledWith('https://api.chatengine.io/users/me/', {
// //       headers: {
// //         'Project-ID': expect.any(String),
// //         'User-Name': user.email,
// //         'User-Secret': user.password,
// //       },
// //     });
// //     expect(res.status).toHaveBeenCalledWith(200);
// //     expect(res.json).toHaveBeenCalledWith({
// //       msg: 'User logged in successfully',
// //       user,
// //       token: 'token',
// //       r: { data: { someData: 'value' } },
// //     });
// //   });

// //   it('should return status 400 and error message if email or password is invalid', async () => {
// //     const validateResult = { error: { details: [{ message: 'Invalid email' }] } };
// //     const loginUserSchema = {
// //       validate: jest.fn().mockReturnValue(validateResult),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(loginUserSchema.validate).toHaveBeenCalledWith(req.body, expect.any(Object));
// //     expect(res.status).toHaveBeenCalledWith(400);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'Invalid email' });
// //   });

// //   it('should return status 400 and error message if user does not exist', async () => {
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(null),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(res.status).toHaveBeenCalledWith(400);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'User does not exist' });
// //   });

// //   it('should return status 400 and error message if password is invalid', async () => {
// //     const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: true };
// //     const bcrypt = {
// //       compare: jest.fn().mockResolvedValue(false),
// //     };
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(user),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
// //     expect(res.status).toHaveBeenCalledWith(400);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'Invalid email or password' });
// //   });

// //   it('should return status 401 and error message if user is not verified', async () => {
// //     const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: false };
// //     const User = {
// //       findOne: jest.fn().mockResolvedValue(user),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
// //     expect(res.status).toHaveBeenCalledWith(401);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'User not verified' });
// //   });

// //   it('should return status 500 and error message if an error occurs', async () => {
// //     const error = new Error('Something went wrong');
// //     console.error = jest.fn(); // Mock console.error to prevent it from printing the error during testing

// //     // Mock the necessary functions to throw an error
// //     const loginUserSchema = {
// //       validate: jest.fn().mockReturnValue({ error }),
// //     };

// //     // Invoke the Login function
// //     await Login(req, res);

// //     // Assertions
// //     expect(loginUserSchema.validate).toHaveBeenCalledWith(req.body, expect.any(Object));
// //     expect(res.status).toHaveBeenCalledWith(500);
// //     expect(res.json).toHaveBeenCalledWith({ Error: 'Something went wrong' });
// //     expect(console.error).toHaveBeenCalledWith(error);
// //   });
// // });

// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import axios from 'axios';
// import { Login } from '../controller/login';
// import User from '../model/registerModel';
// import { loginUserSchema, options } from '../utils/utils';

// jest.mock('bcrypt');
// jest.mock('jsonwebtoken');
// jest.mock('axios');

// describe('Login Endpoint', () => {
//   let req: Request;
//   let res: Response;

//   beforeEach(() => {
//     req = {
//       body: {
//         email: 'test@example.com',
//         password: 'password123',
//       },
//     } as Request;
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       cookie: jest.fn(),
//     } as unknown as Response;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return status 200 and user data if login is successful', async () => {
//     // Mock the necessary functions and objects
//     const user: any = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: true };
//     const jwtSecret = 'mockJwtSecret';
//     const compareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
//     const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValue(user);
//     const signMock = jest.spyOn(jwt, 'sign').mockReturnValue('mockToken');
//     const getMock = jest.spyOn(axios, 'get').mockResolvedValue({ data: { someData: 'value' } });

//     // Invoke the Login function
//     await Login(req, res);

//     // Assertions
//     expect(compareMock).toHaveBeenCalledWith(req.body.password, user.password);
//     expect(findOneMock).toHaveBeenCalledWith({ where: { email: req.body.email } });
//     expect(signMock).toHaveBeenCalledWith({ id: user.id }, jwtSecret, { expiresIn: '30d' });
//     expect(res.cookie).toHaveBeenCalledWith('token', 'mockToken', { httpOnly: true, maxAge: 30 * 60 * 1000 });
//     expect(getMock).toHaveBeenCalledWith('https://api.chatengine.io/users/me/', {
//       headers: {
//         'Project-ID': 'mockProjectId',
//         'User-Name': user.email,
//         'User-Secret': user.password,
//       },
//     });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       msg: 'User logged in successfully',
//       user,
//       token: 'mockToken',
//       r: { data: { someData: 'value' } },
//     });
//   });

//   it('should return status 400 and error message if email or password is invalid', async () => {
//     const validateResult: any = { error: { details: [{ message: 'Invalid email' }] } };
//     const validateMock = jest.spyOn(loginUserSchema, 'validate').mockReturnValue(validateResult);

//     // Invoke the Login function
//     await Login(req, res);

//     // Assertions
//     expect(validateMock).toHaveBeenCalledWith(req.body, options);
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ Error: 'Invalid email' });
//   });

//   it('should return status 400 and error message if user does not exist', async () => {
//     const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValue(null);

//     // Invoke the Login function
//     await Login(req, res);

//     // Assertions
//     expect(findOneMock).toHaveBeenCalledWith({ where: { email: req.body.email } });
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ Error: 'User does not exist' });
//   });

//   it('should return status 400 and error message if password is invalid', async () => {
//     const user: any = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: true };
//     const compareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
//     const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValue(user);

//     // Invoke the Login function
//     await Login(req, res);

//     // Assertions
//     expect(compareMock).toHaveBeenCalledWith(req.body.password, user.password);
//     expect(findOneMock).toHaveBeenCalledWith({ where: { email: req.body.email } });
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ Error: 'Invalid email or password' });
//   });

//   it('should return status 401 and error message if user is not verified', async () => {
//     const user: any = { id: 1, email: 'test@example.com', password: 'hashedPassword', verify: false };
//     const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValue(user);

//     // Invoke the Login function
//     await Login(req, res);

//     // Assertions
//     expect(findOneMock).toHaveBeenCalledWith({ where: { email: req.body.email } });
//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({ Error: 'User not verified' });
//   });

//   it('should return status 500 and error message if an error occurs', async () => {
//     const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
//     const error = new Error('Something went wrong');
//     const findOneMock = jest.spyOn(User, 'findOne').mockRejectedValue(error);

//     // Invoke the Login function
//     await Login(req, res);

//     // Assertions
//     expect(findOneMock).toHaveBeenCalledWith({ where: { email: req.body.email } });
//     expect(consoleErrorMock).toHaveBeenCalledWith(error);
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ Error: 'Something went wrong' });
//   });
// });
