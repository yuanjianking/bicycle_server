var user = require('../models/user');

module.exports = function(app){

    app.post('/login', function(req, res){
        user.find({"userid":req.body.userid}, function(err, message){

            if(message != null && message.length > 0){
                if(message[0].password == req.body.password){
                    res.json({
                        status:200000,
                        objid:message[0]._id,
                        name:message[0].name
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