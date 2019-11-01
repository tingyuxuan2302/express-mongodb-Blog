// const Mongoose = require('mongoose'),
// Schema = Mongoose.Schema,
// User = require('../lib/mongo').User;

// module.exports = {
//     // 注册一个用户
//     create: function create(user) {
//         return User.create(user).exec();
//     },
//     // 通过用户名获取用户信息
//     getUserByName: function getUserByName(name) {
//         return User.findOne({
//             name
//         }).addCreatedAt().exec(); // 使用了 addCreatedAt 自定义插件（通过 _id 生成时间戳）
//     }
// }

