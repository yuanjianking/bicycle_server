var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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
app.use(function(req, res, next){
    if(req.url == "/login" || req.url == "/signup"){
        next();
        return;
    }
    // JWT の検証に必要な公開キーを取得する
    const publicKey = fs.readFileSync('./config/public.key');
    var token = req.header("token");
    // Tokenの検証
    jwt.verify(token, publicKey, (error, decoded) => {
        if (error) {
            console.log("jwt error:" + error.message)
            res.json({
                status:202000
            });
            return
        }
        console.log(decoded)
        next();
    });
});

var userController = require('./controllers/userController');
userController(app);
var eventController = require('./controllers/eventController');
eventController(app);

// 端口
app.listen(8888);

console.log('listening to port 8888');
