var event = require('../models/event');
var user = require('../models/user');
var location = require('../models/location');

module.exports = function(app){

    app.get('/eventList', function(req, res){

        event.find().sort({'_id':-1}).exec(function(err, message){
            if(message != null && message.length > 0){
                res.json({
                    status:200000,
                    eventList: message
                });
            }else{
                res.json({
                    status:201004
                });
            }
        });

    });

    app.post('/eventDetail', function(req, res){
        
        event.find(({
            "userid":req.body.userid,
            "_id":req.body._id
        }), function(err, message){
            if(message != null && message.length > 0){
                res.json({
                    status:200000,
                    eventList: message
                });
            }else{

                event.find(({
                    "userid":req.body.userid
                }), function(err, message){
                    if(message != null && message.length > 0){
                        res.json({
                            status:201006
                        });
                    }else{
                        res.json({
                            status:201002
                        });
                    }
                });

            }
        });

    });

    app.post('/guestLocations', function(req, res){

        event.find(({
            "eventid":req.body.eventid
        }), function(err, message){
            if(message != null && message.length > 0){
                res.json({
                    status:200000,
                    eventList: message
                });
            }else{
                res.json({
                    status:201006
                });
            }
        });

    });


    app.post('/updateGuestLocation', function(req, res){

        location.find(({
            "eventid":req.body.eventid,
            "userid":req.body.userid
        }), function(err, message){
            if(message != null && message.length > 0){

                location.update({
                    "eventid":req.body.eventid,
                    "userid":req.body.userid
                },
                {
                    eventid: req.body.eventid,
                    userid: req.body.userid,
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                }, function(err, message){
                    if(err){
                        console.log(err);
                    }else{
                        res.json({
                            status:200000
                        });
                    }
                });    

            }else{
                
                location({
                    eventid: req.body.eventid,
                    userid: req.body.userid,
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                }).save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.json({
                            status:200000
                        });
                    }
                });

            }
        });

    });

}    