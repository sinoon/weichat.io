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
var ask = require('../Lib/ask');
var mailer = require('../Lib/mailer');

/**
 * 配置信息
 */
var wechatConfig = require("../Config/wechat");

module.exports = wechat(wechatConfig,function ( req,res,next ) {
	var message = req.weixin;

	var content = message.Content;

	var type = message.MsgType;

	if(type == 'event'){
		eventHandle(message,req,res);
		return
	}

	console.log(message);
	console.log(content);

	//mailer('shangnan@qwbcg.com','shangnan@qwbcg.com','测试邮件','测试内容', function ( err,info ) {
	//	res.reply(err + ' || ' + info)
	//});

	ask(content, function ( err,answer ) {
		if(err){
			// Handle error
		}

		res.reply(answer.text)

	});

});

function eventHandle(message,req,res){
	var event = message.MsgType;

	if(event == 'subscribe'){
		// TODO: 订阅
		res.reply("欢迎关注，测试微信号")
	}
}