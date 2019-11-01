module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        console.log('---------', req.session)
        if (!req.session.user) {
            req.flash('error', '未登录');
            // console.log(req.session.user)
            return res.redirect('/signin');
        };
        next();
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登陆');
            return res.redirect('back') // 返回之前的页面
        };
        next();
    }
}
