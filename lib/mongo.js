// const config = require('config-lite')(__dirname),
// Mongolass = require('mongolass'),
// mongolass = new Mongolass();
// mongolass.connect(config.mongodb);

// // 用户模型设计
// exports.User = mongolass.model('User', {
//     name: { type: 'string', required: true },
//     password: { type: 'string', required: true },
//     repassword: { type: 'string', required: true },
//     gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x', required: true },
//     avatar: { type: 'string', required: true }
// });

// // 根据用户名找到用户，用户名全局唯一
// exports.User.index({name: 1}, { unique: true }).exec();


// // 登陆
// // 根据 id 生成创建时间 created_at
// const moment = require('moment')
// const objectIdToTimestamp = require('objectid-to-timestamp')
// mongolass.plugin('addCreatedAt', {
//     afterFind: function(results) {
//         results.forEach(function(item) {
//             item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
//         });
//         return results;
//     },
//     afterFindOne: function (result) {
//         if (result) {
//             result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
//         }
//         return result;
//     }
// });

// exports.Post = mongolass.model('Post', {
//     author: { type: Mongolass.Types.ObjectId, required: true },
//     title: { type: 'string', required: true },
//     content: { type: 'string', required: true },
//     pv: { type: 'number', default: 0 }
// });
// // 按创建时间降序查看用户的文章列表
// exports.Post.index({
//     author: 1,
//     _id: -1
// }).exec();

// // 留言
// exports.Comment = mongolass.model('Comment', {
//     author: {
//         type: Mongolass.Types.ObjectId,
//         required: true
//     },
//     content: {
//         type: 'string',
//         required: true
//     },
//     postId: {
//         type: Mongolass.Types.ObjectId,
//         required: true
//     }
// });
// // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
// exports.Comment.index({
//     postId: 1,
//     _id: 1
// }).exec();


const config = require('config-lite')(__dirname),
    Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
const marked = require('marked');
Mongoose.connect(config.mongodb, {
    autoIndex: false, // 默认情况下，mongoose 在连接时会自动建立 schema 的索引
    useNewUrlParser: true
});
Mongoose.connection.on('error', function (err) {
    console.log('-----连接数据库失败-----' + err);
});
Mongoose.connection.once('open', function () {
    console.log('-----连接数据库成功-----')
})


/* --------- 定义User ---------- */
// 定义UserSchema
const UserSchema = new Schema({
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    repassword: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x', required: true },
    avatar: { type: 'string', required: true }
});
// 根据用户名找到用户,设置name唯一索引，用户名全局唯一
UserSchema.index({
    name: 1
}, {
        unique: true
    });

// 通过用户名获取用户信息
UserSchema.methods.getUserByName = function (name) {
    return this.model('User').findOne({ name });
}
// 将Schema发布为Model
exports.UserModel = Mongoose.model('User', UserSchema);



/* --------- 定义Post ---------- */
// 主页
const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    title: { type: 'string', required: true },
    content: { type: 'string', required: true },
    pv: { type: 'number', default: 0 },
    commentsCount: { type: 'number', default: 0 }
});
// 按创建时间降序查看用户的文章列表
PostSchema.index({
    author: 1,
    _id: -1
});
PostSchema.methods.incPv = function (postId) {
    return this.model('Post').update({ _id: postId }, { $inc: { pv: 1 } }).exec();
}
// 根据用户信息获取用户所有文章
PostSchema.methods.getPosts = function (author) {
    const query = {};
    if (author) {
        query.author = author
    };
    return this.model('Post')
        .find(query)
        .populate({ path: 'author', model: 'User' })// 使用Population可以实现在一个 document 中填充其他 collection(s) 的 document(s)
        .sort({ _id: -1 })
        .exec()
}
// 通过文章 id 获取一篇文章
PostSchema.methods.getPostById = function (postId) {
    return this.model('Post')
        .findOne({ _id: postId })
        .populate({ path: 'author', model: 'User' })
        .exec()
};
// 通过文章 id 获取一篇原生文章（编辑文章）
PostSchema.methods.getRawPostById = function (postId) {
    return this.model('Post').findOne({
        _id: postId
    }).populate({ path: 'author', model: 'User' }).exec();
}
// 通过文章 id 更新一篇文章
PostSchema.methods.updatePostById = function (postId, data) {
    return this.model('Post').update({
        _id: postId
    }, {
            $set: data
        }).exec();
}

// 通过文章 id 删除一篇文章
PostSchema.methods.delPostById = function (postId) {
    return this.model('Post').deleteOne({
        _id: postId
    }).exec();
}

exports.PostModel = Mongoose.model('Post', PostSchema);



/* --------- 定义Comment ---------- */
// 留言
const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: 'string', required: true },
    postId: { type: Schema.Types.ObjectId, required: true }
});
// 通过文章 id 获取该文章下所有留言，按留言创建时间升序

CommentSchema.methods.getComments = function (postId) {
    return this.model('Comment')
        .find({ postId: postId })
        .populate({ path: 'author', model: 'User' })
        .exec()
};

// 通过留言 id 获取一个留言
CommentSchema.methods.getCommentById = function (commentId) {
    return this.model('Comment').findOne({ _id: commentId }).exec()
};

// 通过留言 id 删除一个留言
CommentSchema.methods.delCommentById = function (commentId) {
    return this.model('Comment').deleteOne({ _id: commentId }).exec()
};
// 通过文章 id 获取该文章下留言数
// CommentSchema.methods.getCommentsCount = function(postId) {
//     return this.model('Comment').count({ postId: postId }).exec()
// }
exports.CommentModel = Mongoose.model('Comment', CommentSchema);
