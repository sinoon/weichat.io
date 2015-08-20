/**
 * Created by sinoon on 15/8/20.
 */

var express = require('express');
var router = express.Router();

var wechatController = require('../Controller/wechat');

router.get('/',wechatController.index);

//var

router.get('/test', wechatController.goOauth);

router.get('/oauth',wechatController.oauth);

module.exports = router;