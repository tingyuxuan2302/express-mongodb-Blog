const express = require('express'),
router = express.Router();

router.get('/:name', function(req, res) {

    // 发送http响应，参数可以是Buffer,String,Object,Array...
    // 该方法还能根据参数类型自动设置响应头Content-Type
    // res.send('hello,' + req.params.name);
    // res.send(Buffer.from('<p>some html</p>'))
    // res.send({ user: 'tobi' })

    // 渲染视图并将渲染后的html字符串发送给客户端
    res.render('users', {
        name: req.params.name
    })
});
module.exports = router;
