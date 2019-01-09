var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// mongod --dbpath /usr/local/var/mongodb/
mongoose.connect('mongodb://localhost:27017/bicycledb',{useNewUrlParser: true}, function(err, db){
    if(err){
        console.log("db connect error");
    }else{
        console.log("db connect success");
    }
});//mongodb://name:pwd@localhost/restdb

var app = express();
// 静态文件夹
app.use(express.static('./assets'));
app.use(bodyParser());

var userController = require('./controllers/userController');
userController(app);
var eventController = require('./controllers/eventController');
eventController(app);

// 端口
app.listen(8880);

console.log('listening to port 8880');
