const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash'); // 页面消息通知
const config = require('config-lite')(__dirname); // 读取配置文件config
const routes = require('./routes');
const pkg = require('./package');


const app = express();

/* ------------ 试例讲解 ------------- */
// 中间件与next
// app.use(function (req, res, next) {
//     console.log('1')
//     // 将控制权传递给下一个中间件函数
//     next();
// })

// app.use(function (req, res, next) {
//     console.log('2')
//     res.status(200).end();
// })
// const userRouter = require('./routes/users');
// // 挂载指定的中间件到指定的路径上，当基础路径与访问路径匹配上的时候执行中间件函数
// app.use('/users', userRouter);

// // // 设置存放模板文件的目录,路径也可是数组，程序会按照视图在数组中出现的顺序进行查找.
// app.set('views', path.join(__dirname, 'pages'));
// // 设置模板引擎为 ejs
// app.set('view engine', 'ejs');

// app.listen(8888);














// 设置模版目录
app.set('views', path.join(__dirname, 'pages'));
// 设置模版引擎为ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session中间件
app.use(session({
    name: config.session.key, // 设置cookie中保存session id的字段名称
    secret: config.session.secret, // 通过设置secret来计算hash值并存放在cookie中，使产生的signedCookie防篡改
    resave: true, // 强制更新session
    saveUninitialized: false, // 强制创建一个session,即使用户未登录
    cookie: {
        maxAge: config.session.maxAge // 过期时间，过期后cookie中的session id自动删除
    },
    store: new MongoStore({ // 将session存储到mongodb
        url: config.mongodb // mongodb地址
    })
}));

// // flash中间件，用来显示通知
app.use(flash());
// // 实现复用页面通知
// app.use(function (err, req, res, next) {
//     console.error(err);
//     req.flash('error', err.message);
//     res.redirect('/posts');
// })

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true// 保留后缀
}));


// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};
// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})


// 路由
routes(app);

// 监听端口，启动程序
app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
});
