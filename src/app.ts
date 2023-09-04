import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import resetRouter from "./routes/resetPassword";
import googleRouter from "./routes/google";
import postRoute from "./routes/posts";
import cors from 'cors';
import commentRouter from "./routes/comments"
import registerRouter from './routes/register';
const groupRouter = require("./routes/group");
import { connectDb, sequelize } from './config/database';
import {socketapi, router} from "./config/chatEngine"

 

const app = express();

app.use(
  cors({
    origin:true,
    credentials: true,
  })
);


app.set('view engine', 'ejs'); // Replace 'ejs' with your desired view engine


app.set('views', path.join(__dirname, 'views')); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Remove the 'ch-ua-form-factor' feature from the Permissions-Policy header
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()');
  next();
});


app.use('/user', registerRouter);
app.use('/auth', googleRouter);
app.use('/user', resetRouter);

app.use("/group", groupRouter)
app.use('/post', postRoute)
app.use('/comment', commentRouter)
app.use('/api', router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


//DB connection
const syncDatabase = async () => {
  await connectDb();
  sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully');
  });
};

syncDatabase();
// error handler
app.use(function (err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default {app, socketapi};