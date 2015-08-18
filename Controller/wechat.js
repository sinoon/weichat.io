/**
 * Created by sinoon on 15/8/18.
 */

/**
 * 原始库
 */
var wechat = require('wechat');
var request  = require('request');

/**
 * 自写的方法
 */
var ask = require('../Utils/ask');
var mailer = require('../Utils/mailer');

var wechatConfig = require("../Config/wechat");

module.exports = wechat(wechatConfig,function ( req,res,next ) {
	var message = req.weixin;

	var content = message.Content;

	console.log(message);
	console.log(content);

	mailer('shangnan@qwbcg.com','shangnan@qwbcg.com','测试邮件','测试内容', function ( err,info ) {
		res.reply(info)
	});

	//ask(content, function ( err,answer ) {
	//	if(err){
	//		// TODO: Handle error
	//	}
	//
	//	res.reply(answer.text)
	//
	//});

});