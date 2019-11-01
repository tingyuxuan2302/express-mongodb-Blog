const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

/* -------- 路由试例 --------- */

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
// router.get('/', function (req, res, next) {
//     res.send('主页')
// })

// // POST /posts/create 发表一篇文章
// router.post('/create', checkLogin, function (req, res, next) {
//     res.send('发表文章')
// })

// // GET /posts/create 发表文章页
// router.get('/create', checkLogin, function (req, res, next) {
//     res.send('发表文章页')
// })

// // GET /posts/:postId 单独一篇的文章页
// router.get('/:postId', function (req, res, next) {
//     res.send('文章详情页')
// })

// // GET /posts/:postId/edit 更新文章页
// router.get('/:postId/edit', checkLogin, function (req, res, next) {
//     res.send('更新文章页')
// })

// // POST /posts/:postId/edit 更新一篇文章
// router.post('/:postId/edit', checkLogin, function (req, res, next) {
//     res.send('更新文章')
// })

// // GET /posts/:postId/remove 删除一篇文章
// router.get('/:postId/remove', checkLogin, function (req, res, next) {
//     res.send('删除文章')
// })





const PostModel = require('../lib/mongo').PostModel;
const CommentModel = require('../lib/mongo').CommentModel;

// GET /posts 所有用户或者特定用户的文章页
// eg: GET /posts?author=xxx
// 主页与用户页通过 url 中的 author 区分。
router.get('/', function (req, res, next) {
    // res.render('posts')
    // 根据用户name查找返回该用户的blog
    const author = req.query.author // req.query查找键值对
    new PostModel().getPosts(author).then(function(posts) {
        res.render('posts', {
            posts
        })
    }).catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    res.render('create');
});

// // POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
    // res.send('发表文章');
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content
    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }
    let post = {
        author: author,
        title: title,
        content: content
    }

    PostModel.create(post).then(function (result) {
        // 此 post 是插入 mongodb 后的值，包含 _id
        const post = result;
        req.flash('success', '发表成功');
        // 发表成功后跳转到该文章页
        res.redirect(`/posts/${post._id}`)
    }).catch(next);
});



// // GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
    // res.send('文章详情页')
    const postId = req.params.postId;
    const query = {};
    if (postId) {
        query._id = postId
    }
    Promise.all([
        new PostModel().incPv(postId),
        new PostModel().getPostById(postId),
        new CommentModel().getComments(postId),
        // new CommentModel().getCommentsCount(postId)
    ]).then(function(result) {
        console.log('-----post-----', result);
        const post = result[1],
        comments = result[2];
        if (!post) {
            throw new Error('该文章不存在');
        };
        res.render('post', {
            post,
            comments
        }).catch(next);
    })

});

// // GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    // res.send('更新文章页');
    const postId = req.params.postId
    const author = req.session.user._id

    new PostModel().getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error('该文章不存在')
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足')
            }
            res.render('edit', {
                post: post
            })
        })
        .catch(next)
});

// // // POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    // res.send('更新文章');
    const postId = req.params.postId
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    new PostModel().getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }
            new PostModel().updatePostById(postId, { title: title, content: content })
                .then(function () {
                    req.flash('success', '编辑文章成功')
                    // 编辑成功后跳转到上一页
                    res.redirect(`/posts/${postId}`)
                })
                .catch(next)
        })
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    // res.send('删除文章');
    const postId = req.params.postId
    const author = req.session.user._id

    new PostModel().getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }
            new PostModel().delPostById(postId)
                .then(function () {
                    req.flash('success', '删除文章成功')
                    // 删除成功后跳转到主页
                    res.redirect('/posts')
                })
                .catch(next)
        })
});

module.exports = router


