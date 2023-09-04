import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUserSchema, options } from '../utils/utils';
import User from '../model/registerModel';

const jwtSecret = process.env.JWT_SECRET_KEY as string;

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Validate with Joi
    const validateResult = loginUserSchema.validate(req.body, options);

    if (validateResult.error) {
      return res.status(400).json({ Error: validateResult.error.details[0].message });
    }

    // Find user in database
    const user = await User.findOne({
      where: { email: email },
    });

    // Check if user exists and password is correct
    if (!user) {
      return res.status(400).json({ Error: 'User does not exist' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ Error: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.verify) {
      return res.status(401).json({ Error: 'User not verified' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '30d' });

    return res.status(200).json({
      msg: 'User logged in successfully',
      user,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: 'Something went wrong' });
  }
};