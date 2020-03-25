const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));
app.use(cors());
// json 형식의 본문 처리
app.use(express.json());
// form으로 넘어온 데이터 처리
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); //'nodebirdCookie'도 secrete
app.use(expressSession({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true, //js로 쿠키 접근 불가
        secure : false, //https 쓸 떄 true로
    },
    name : 'hellornbck'
}));
app.use(passport.initialize());
// passport session은 무조건 expression session 미들웨어 밑에 적어줘야 한다
app.use(passport.session());

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(7070, () => {
    console.log('server is running on localhost:7070');
});