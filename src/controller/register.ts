// import necessary modules and dependencies
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserAttributes } from '../model/registerModel';

import { v4 as uuidv4 } from 'uuid';
import { generateOtp, sendVerificationOTP } from '../utils/resetPassword';


export const register = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    mentalCondition,
    country,
    state,
    gender,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(404).send('Password does not match');
  }

  try {
    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res.status(404).send('This User already exists');
    
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const { otp, otp_expiry } = generateOtp();

    const newUser: UserAttributes = await User.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      mentalCondition,
      country,
      state,
      gender,
      password: encryptedPassword,
      otp,
      otp_expiry,
      verify: false,
      blocked:[],
      profilePhoto: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
    });

    const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET_KEY || 'SECRET-KEY', {
      expiresIn: '7d',
    });

    await sendVerificationOTP(newUser.email, newUser.otp);

    return res.status(201).json({
      userDetails:newUser,
      token
     });
  } catch (err) {
    console.log(err);
    return res.status(500).send('An error occurred, please try again');
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({ where: { otp } });

    if (!user) {
      return res.status(404).json({Error: 'User not found'});
    }

    if (user.verify) {
      return res.status(400).json({Error: 'User already verified'});
    }

    const currentTime = new Date();
    if (currentTime > user.otp_expiry) {
      return res.status(400).json({Error: 'OTP has expired'});
    }

    // Update user verification status
    user.verify = true;
    await user.save();

    return res.status(200).json({message: 'OTP verified successfully'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({Error: 'An error occurred, please try again'});
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.findAll();
    console.log(allUsers);

    if (!allUsers) {
      return res.status(404).json({ Error: 'No Users found' });
    }
    return res.status(200).json({ allUsers });
  } catch (error) {
    return res.status(500).json({ error });
  }
};