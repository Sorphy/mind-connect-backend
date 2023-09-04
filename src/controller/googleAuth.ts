import {Request, Response, NextFunction} from 'express';
import axios from "axios"
import jwt from "jsonwebtoken"
import { getTokens } from '../utils/googleauth';
import User, { UserAttributes } from '../model/registerModel';

const GOOGLE_CLIENT_ID =process.env.CLIENT_ID
const GOOGLE_CLIENT_SECRET =process.env.CLIENT_SECRET
const port = 3000;
const JWT_SECRET_KEY= process.env.JWT_SECRET_KEY as string


export const googleSignIn = async (req:Request, res:Response) => {
    try {
        const code = req.query.code 
  
    const { id_token, access_token } = await getTokens({
      code,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: `http://localhost:${port}/auth/google`,
    });
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }  
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
        
     const user = await User.findOne({ where: { email:googleUser.email} });
  
    if(!user){
    const newUser: UserAttributes = await User.create({
        id: googleUser.id,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email:googleUser.email,
        mentalCondition:"",
        country:"",
        state:"" ,
        password:"",
        gender: "",    
        otp:null,
        otp_expiry: null,
        blocked:[],
        profilePhoto: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
        // verify: true
         });
         
     const token = jwt.sign({ id: newUser.id }, JWT_SECRET_KEY,{ expiresIn: '30d' });
     res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });  
    //  return res.status(200).json({ message: 'User registered successfully' });
    res.redirect("http://localhost:5173/dashboard")
     }
  
    } catch (error) {
      console.log(error)
        return res.status(500).json({ Error: 'Internal Server Error' });

    }
  }
