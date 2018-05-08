var express = require("express");
var mongoose = require('mongoose');
var DB_URL = 'mongodb://localhost:27017/discuss';
var bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);

var logger = require("morgan");
var FileStreamRotator = require('file-stream-rotator');
var fs = require("fs");

var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname , 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// 每天在log目录下生成访问日志
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});
app.use(logger('combined', {stream: accessLogStream}));

// session持久化存储mongodb数据库
app.use(session({
    secret: "discuss",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000,
        httpOnly: true
    },
    store: new mongoStore({
        url: DB_URL,
        collection: "sessions"
    })
}));

//引入路由对应执行文件

var indexFunction = require('./routers/index');
var detailFunction = require('./routers/detail');
var signFunction = require('./routers/sign');
var signInFunction = require('./routers/signIn');
var signUpFunction = require('./routers/signUp');
var listFunction = require('./routers/list');
var editInFunction = require('./routers/editIn');
var safelogFunction = require('./routers/safelog');
var deleteFunction = require('./routers/delete');


//首页
app.get('/', indexFunction);

//详情页
app.get('/detail/:pageId', detailFunction);

//登陆注册页
app.get('/sign/:type', signFunction);

//登陆逻辑
app.post('/signIn', signInFunction);

//注册逻辑
app.post('/signUp', signUpFunction);

//列表页
app.get('/list', listFunction);

//编辑成功
app.post('/editIn', editInFunction);

//删除逻辑
app.get('/list/delete', deleteFunction);

//安全日志
app.get('/safelog', safelogFunction);

//注销账户
app.get('/logout',function(req, res){
    delete req.session.user;
    res.render('../views/alert',{name: "", type: 6, uname: ""});
});

app.listen('3000');
