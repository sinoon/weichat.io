/**
 * Created by sinoon on 15/8/18.
 */

/**
 * 原始库
 * @type {wechat|exports|module.exports}
 */
var wechat = require('wechat');
var request  = require('request');

/**
 * 自写的方法
 */
var ask = require('../Utils/ask');

var wechatConfig = require("../Config/wechat");

module.exports = wechat(wechatConfig,function ( req,res,next ) {
	var message = req.weixin;

	var content = message.Content;

	console.log(message);
	console.log(content);

	ask(content, function ( err,answer ) {
		if(err){
			// TODO: Handle error
		}

		res.reply(answer.text)

	});

});