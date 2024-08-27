const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser'); //요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');
const app = express();

db.sequelize.sync();  //{ force : true } : db 전체를 초기화 데이터 다 날라감 주의
passportConfig();

app.use(morgan('dev')); //console에 기록해준다.
app.use(cors({ 
    origin: 'http://localhost:3080',
  credentials: true,
}));//error 방지 : has been blocked by CORS policy: Response to preflight request doesn't pass access control check
app.use('/', express.static('uploads')); //업로드 이미지파일이 깨지기때문에 프론트에서 접근할수있도록 주소를 가져다주도록한다.
app.use(express.json()); //express에서는 직접적으로 json을 받을 수없어서 
app.use(express.urlencoded({ extended: false }));
app.use(cookie('cookiesecret'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.status(200).send('hello backend!!!!');
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

app.post('/post', (req, res) => {
  if (req.isAuthenticated()) {

  }
});

app.listen(3085, () => {
  console.log(`backend server port: ${3085}..`);
});