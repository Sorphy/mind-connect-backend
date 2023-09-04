import express, {Request, Response, NextFunction} from 'express';
import { googleSignIn } from '../controller/googleAuth';
import { getGoogleAuthURL } from '../utils/googleauth';



const router = express.Router();

router.get(`/google/url`,(req:Request,res:Response)=>{
    res.redirect(`${getGoogleAuthURL()}`)
  
});
router.get(`/google`,googleSignIn);


export default router