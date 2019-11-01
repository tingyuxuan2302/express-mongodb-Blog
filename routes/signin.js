const express = require('express')
const router = express.Router()
const sha1 = require('sha1')

const checkNotLogin = require('../middlewares/check').checkNotLogin
// const UserModel = require('../models/user')
const UserModel = require('../lib/mongo').UserModel;

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin');
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    const name = req.fields.name,
        password = req.fields.password;
    // 校验参数
    try {
        if (!name.length) {
            throw new Error('请填写用户名')
        }
        if (!password.length) {
            throw new Error('请填写密码')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }
    new UserModel().getUserByName(name).then(function(user) {
        console.log('signin user', user);
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('back');
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
            req.flash('error', '用户名或密码错误')
            return res.redirect('back');
        }
        req.flash('success', '登录成功');
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/posts')
    }).catch(next)
})

module.exports = router
