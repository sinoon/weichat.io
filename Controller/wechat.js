/**
 * Created by sinoon on 15/8/18.
 */

/**
 * 原始库
 */
var wechat = require('wechat');
var request  = require('request');
var OAuth = require('wechat-oauth');

/**
 * 自写的方法
 */
var ask = require('../Lib/ask');
var mailer = require('../Lib/mailer');

/**
 * 配置信息
 */
var wechatConfig = require("../Config/wechat");

module.exports.index = wechat(wechatConfig,function ( req,res,next ) {
	var message = req.weixin;

	var content = message.Content;

	console.log(req.session);
	console.log(req.wxsession);

	var type = message.MsgType;

	if(type == 'event'){
		eventHandle(message,req,res);
		return
	}

	if(content == '授权测试'){
		return res.reply('/wechat/test')
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

var client = new OAuth(wechatConfig.appid);
module.exports.goOauth = function ( req,res,next ) {
	if(!req.session.openid){
		var url = client.getAuthorizeURL('/wechat/oauth', 'state', 'snsapi_userinfo');

		return res.redirect(url)
	}

	res.end(req.session.openid)

};

module.exports.oauth = function ( req,res,next ) {
	if(req.session.openid){
		return res.redirect('/wechat/test')
	}

	var code = req.query.code;
	console.log('code:' + code);
	res.send(code);

	if(!code){
		return res.end('没有授权失败 : ' + req.originalUrl)
	}

	client.getAccessToken(code, function ( err,result ) {
		var accessToken = result.data.access_token;
		var openid = result.data.openid;
		console.log(accessToken);
		console.log(openid);

		res.send(accessToken);
		res.send(openid);

		client.getUser(openid, function ( err,result ) {
			var userInfo = result;
			console.log(userInfo);
			res.end(userInfo);
		})
	})
};

function eventHandle(message,req,res){
	var event = message.MsgType;

	if(event == 'subscribe'){
		// TODO: 订阅
		res.reply("欢迎关注，测试微信号")
	}
}