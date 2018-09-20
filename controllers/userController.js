var user = require('../models/user');

module.exports = function(app){
    app.get('/todo', function(req, res){
        var obj = "{name:\"zhangsan\"}";

        user({
            name: 'zs2',
            email: 'zs2@qq.com',
            userName: 'admin2',
            password: '123'
        }).save(function(err){
            if(err){
                console.error(err);
            }
            console.log("add");
        });

        res.end(obj);
    });

    // 登录
    app.post('/login', function(req, res){
        res.writeHead(200, {'Content-Type':'application/json'});
        var obj = {
            code: 0,
            message: "error",
            content: any = null
        }
        var data = "";
        req.on("error", function(err){

        }).on("data", function(chunk){
            data += chunk;
        }).on("end", function(){
            console.log(data);
            var u = JSON.parse(data);

            user.find({"userName":u.userName}, function(err, message){
                if(err){
                    console.log("find error");
                }
                console.log(message);
                if(message != null && message.length > 0){
                    if(message[0].password == u.password){
                        obj.code = 1;
                        obj.message = "success";
                        obj.content = message[0];
                        res.end(JSON.stringify(obj));
                        console.log(JSON.stringify(obj));
                        return;
                    }
                }
                res.end(JSON.stringify(obj));
            });
            
        });
    });
}