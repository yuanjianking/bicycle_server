var event = require('../models/event');
var user = require('../models/user');
var location = require('../models/location');

module.exports = function(app){

    app.post('/makeEvent', function(req, res){

        var startTime = new Date(req.body.startDate + ' ' + req.body.startTime).getTime();
        var endTime = new Date(req.body.endDate + ' ' + req.body.endTime).getTime();
        var nowTime = new Date().getTime();
        if(isNaN(startTime) || isNaN(endTime) || endTime <= startTime || startTime <= nowTime){            
            res.json({
                status:201005
            });
            return;
        }

        user.find({"userid":req.body.userid}, function(err, message){
            if(message != null && message.length > 0){
                
                event({
                    userid: req.body.userid,
                    name: req.body.name,
                    detail: req.body.detail,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    endMillisecond: endTime
                }).save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.json({
                            status:200000
                        });
                    }
                });

            }else{
                res.json({
                    status:201002
                });
            }
        });
    });

    app.get('/eventList', function(req, res){
        var date = new Date();
        event.find({"endMillisecond": {$gte: date.getTime()}}).sort({'_id':-1}).exec(function(err, message){
            if(message != null && message.length > 0){
                res.json({
                    status:200000,
                    sysTime:date.getTime(),
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

    app.post('/guestHistoryLocation', function(req, res){
        var startTime = new Date(req.body.startDate + ' ' + req.body.startTime).getTime();
        var endTime = new Date(req.body.endDate + ' ' + req.body.endTime).getTime();
        var nowTime = new Date().getTime();

        // event未開始
        if(nowTime < startTime || nowTime > endTime){
            res.json({
                status:201000
            });
            return;
        }

        location.find(({
            "eventid":req.body.eventid,
            "userid":req.body.userid
        }), function(err, message){
            if(message != null && message.length == 1){

                res.json({
                    status:200000,
                    sysTime: new Date().getTime(),
                    locations: message
                });

            }else {
                res.json({
                    status:201006
                });
            }
        });
    });

    app.post('/guestLocations', function(req, res){
        // location.aggregate(
        //     [
        //         {$match: {"eventid":req.body.eventid}},
        //         {$sort: {'_id':-1}},
        //         {$group: {_id:'$userid', "userid":{$first: "$userid"}, number: {$sum: 1}, "latitude": {$first: "$latitude"}, "longitude": {$first: "$longitude"} }}
        //     ]).then(function(message){
        //         console.log(message);
        //         res.json({
        //             status:200000,
        //             locations: message
        //         });
        //     });

        location.find(({
            "eventid":req.body.eventid
        }), function(err, message){
            if(message != null && message.length > 0){
                res.json({
                    status:200000,
                    locations: message
                });
            }else{
                res.json({
                    status:201006
                });
            }
        });

    });


    app.post('/updateGuestLocation', function(req, res){

        var startTime = new Date(req.body.eventStartDate + ' ' + req.body.eventStartTime).getTime();
        var endTime = new Date(req.body.eventEndDate + ' ' + req.body.eventEndTime).getTime();
        var nowTime = new Date().getTime();

        // event未開始
        if(nowTime < startTime || nowTime > endTime){
            res.json({
                status:201000
            });
            return;
        }

        location.find(({
            "eventid":req.body.eventid,
            "userid":req.body.userid
        }), function(err, message){
            if(message != null && message.length > 0){

                var sT = message[0].startTime;
                var currentDis = +req.body.currentDistance;
                var historyDis = +req.body.historyDistance;
                var distance;
                // 歴史歩行距離が未取になり、ユーザー座標を更新する場合
                if(historyDis == 0){
                    distance = +message[0].historyDistance + currentDis;
                }else{
                    distance = historyDis + currentDis;
                }
                location.updateOne({
                    "eventid":req.body.eventid,
                    "userid":req.body.userid
                },
                {
                    eventid: req.body.eventid,
                    userid: req.body.userid,
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    historyDistance: distance
                }, function(err, message){
                    if(err){
                        console.log(err);
                    }else{
                        res.json({
                            status:200000,
                            sysTime: new Date().getTime(),
                            startTime: sT
                        });
                    }
                });    

            }else{
                
                location({
                    eventid: req.body.eventid,
                    userid: req.body.userid,
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    startTime: nowTime,
                    historyDistance: req.body.historyDistance
                }).save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.json({
                            status:200000,
                            sysTime: new Date().getTime(),
                            startTime: nowTime
                        });
                    }
                });

            }
        });

    });

}    