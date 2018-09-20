var express = require('express');
var mongoose = require('mongoose');
// mongod --dbpath /usr/local/var/mongodb/
mongoose.connect('mongodb://localhost:27017/bicycledb',{useNewUrlParser: true});//mongodb://name:pwd@localhost/restdb

var app = express();
// 静态文件夹
app.use(express.static('./assets'));

var userController = require('./controllers/userController');
userController(app);

// 端口
app.listen(8888);

console.log('listening to port 8888');
