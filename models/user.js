var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    userid: String,
    password: String
});

// 表与模型
module.exports = mongoose.model('user', userSchema);