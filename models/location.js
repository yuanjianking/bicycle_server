var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    eventid: String,
    userid: String,
    name: String,
    latitude: String,
    longitude: String,
    startTime: String,
    historyDistance: String
});

// 表与模型
module.exports = mongoose.model('location', locationSchema);