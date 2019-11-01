const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/check").checkLogin;
const CommentModel = require('../lib/mongo').CommentModel;

// POST /comments 创建一条留言
router.post("/", checkLogin, function (req, res, next) {
    // res.send("创建留言");
    const author = req.session.user._id,
    postId = req.fields.postId,
    content = req.fields.content;
    try {
        if (!content.length) {
            throw new Error('请填写留言内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    };
    const comment = {
        author,
        postId,
        content
    };
    CommentModel.create(comment).then(function() {
        req.flash('success', '留言成功');
        res.redirect('back');
    }).catch(next);
});

// GET /comments/:commentId/remove 删除一条留言
router.get("/:commentId/remove", checkLogin, function (req, res, next) {
    // res.send("删除留言");
    const commentId = req.params.commentId,
    author = req.session.user._id;
    new CommentModel().getCommentById(commentId).then(function(comment) {
        // if (!comment) {
        //     throw new Error('留言不存在');
        // }
        // if (comment.author.toString() !== author.toString()) {
        //     throw new Error('没有权限删除留言')
        // };
        new CommentModel().delCommentById(commentId).then(function() {
            req.flash('success', '删除留言成功');
            res.redirect('back');
        }).catch(next);
    }).catch(function(err) {
        console.log(err)
        req.flash('error', err.message)
    })
});

module.exports = router;
