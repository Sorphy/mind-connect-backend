import nodemailer from 'nodemailer'
import { SENDINBLUE_USER, SENDINBLUE_HOST, SENDINBLUE_PASSWORD, FROM_ADMIN_MAIL, USER_SUBJECT } from '../config/mail';


//Email notification
let transport = nodemailer.createTransport({
    host:SENDINBLUE_HOST,
    auth: {
        user: SENDINBLUE_USER,
        pass: SENDINBLUE_PASSWORD
    },
    tls: {
        rejectUnauthorized:false
    }
})

export const sendEmail = async (
    from: string,
    to: string,
    subject: string,
    html: string
)=>{
    try {
        const response = await transport.sendMail({
            from: FROM_ADMIN_MAIL,
            to,
            subject: USER_SUBJECT,
            html
        });

        return response;

    } catch (err) {
        console.log(err)
    }
}