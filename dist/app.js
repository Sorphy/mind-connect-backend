"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const resetPassword_1 = __importDefault(require("./routes/resetPassword"));
const google_1 = __importDefault(require("./routes/google"));
const posts_1 = __importDefault(require("./routes/posts"));
const cors_1 = __importDefault(require("cors"));
const comments_1 = __importDefault(require("./routes/comments"));
const register_1 = __importDefault(require("./routes/register"));
const groupRouter = require("./routes/group");
const database_1 = require("./config/database");
const chatEngine_1 = __importDefault(require("./config/chatEngine"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.set('view engine', 'ejs'); // Replace 'ejs' with your desired view engine
app.set('views', path_1.default.join(__dirname, 'views'));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Remove the 'ch-ua-form-factor' feature from the Permissions-Policy header
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()');
    next();
});
app.use('/user', register_1.default);
app.use('/auth', google_1.default);
app.use('/user', resetPassword_1.default);
app.use("/group", groupRouter);
app.use('/post', posts_1.default);
app.use('/comment', comments_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
//DB connection
const syncDatabase = async () => {
    await (0, database_1.connectDb)();
    database_1.sequelize.sync({ force: false }).then(() => {
        console.log('Database synced successfully');
    });
};
syncDatabase();
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = { app, socketapi: chatEngine_1.default };
