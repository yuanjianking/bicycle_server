var user = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = function(app){

    app.post('/login', function(req, res){
        user.find({"userid":req.body.userid}, function(err, message){
            if(message != null && message.length > 0){
                if(message[0].password == req.body.password){

                    const payload = {
                        objid:message[0]._id,
                        name:message[0].name,
                    };
                    // JWT を発行するために必要なキーを取得します。
                    const privateKey = fs.readFileSync('./config/private.key');
                    // 秘密鍵トークンに従って発行される
                    const tokenRS256 = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn : 60 * 60 * 24});

                    res.json({
                        status:200000,
                        objid:message[0]._id,
                        name:message[0].name,
                        token: tokenRS256
                    });
                }else{
                    res.json({
                        status:201003
                    });
                }
            }else{
                res.json({
                    status:201002
                });
            }
        });
    });

    app.post('/signup', function(req, res){
        user.find({"userid":req.body.userid}, function(err, message){
            if(message != null && message.length > 0){
                res.json({
                    status:201001
                });
            }else{
                user({
                    name: req.body.name,
                    userid: req.body.userid,
                    password: req.body.password
                }).save(function(err, result){
                    console.log(result);
                    if(err){
                        console.error(err);
                    }else{
                        res.json({
                            status:200000,
                            objid:result._id
                        });
                    }
                });
            }
        });

    });
}