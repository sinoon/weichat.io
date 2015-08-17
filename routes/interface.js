/**
 * Created by sinoon on 15/8/4.
 */

var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/getEventList', function(req, res, next) {
    res.set("Access-Control-Allow-Origin","*");

    var url = req.originalUrl.split("?")[1];
    console.log(url);
    request.get("http://192.168.1.201/index.php/Mobile/Weijson/getEventList?" + url, function (req,ress,body) {
        res.send(body)
    });
});

router.get('/getJoinUserInfo', function (req,res,next) {
    res.set("Access-Control-Allow-Origin","*");

    var url = req.originalUrl.split("?")[1];
    request.get("http://192.168.1.201/index.php/Mobile/Weijson/getJoinUserInfo?" + url, function (_req,_res,body) {
        res.send(body)
    })
});

router.get('/bindingWsUser', function (req,res,next) {
    res.set("Access-Control-Allow-Origin","*");

    var url = req.originalUrl.split("?")[1];
    request.get("http://192.168.1.201/index.php/Mobile/Weijson/bindingWsUser?" + url, function (_req,_res,body) {
        res.send(body)
    })
});

module.exports = router;