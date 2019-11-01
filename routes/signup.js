const express = require('express')
const router = express.Router();
const fs = require('fs'),
    path = require('path'),
    sha1 = require('sha1');

// const UserModel = require('../models/user');
const UserModel = require('../lib/mongo').UserModel,
userModelCons = new UserModel();

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
    // res.send('注册页面');
    res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
    let name = req.fields.name,
        gender = req.fields.gender,
        avatar = req.files.avatar.path.split(path.sep).pop(),
        password = req.fields.password,
        repassword = req.fields.repassword;
    //    console.log('-------', avatar);
    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字请限制在 1-10 个字符')
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符')
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致')
        }
        if (!req.files.avatar.name) {
            throw new Error('缺少头像')
        }

    } catch (err) {
        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.avatar.path)
        req.flash('error', err.message)
        return res.redirect('back')
    }
    // 明文密码加密
    password = sha1(password);
    // 待写入数据库的用户信息
    let user = {
        name,
        password,
        gender,
        avatar
    };
    // Model自带create方法
    UserModel.create(user)
        .then(result => {
            console.log('--------result-------', result)
            // 此 user 是插入 mongodb 后的值，包含 _id
            // user = result.ops[0];
            user = result;
            // 删除密码这种敏感信息，将用户信息存入 session
            delete user.password
            req.session.user = user;
            req.flash('success', '注册成功')
            // 跳转到首页
            res.redirect('/posts')
        })
        .catch(function (e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path);
            // 用户名被占用则跳回注册页，而不是错误页
            if (e.message.match('duplicate key')) {
                req.flash('error', '用户名已被占用');
                return res.redirect('/signup')
            }
            next(e)
        })
})

module.exports = router
