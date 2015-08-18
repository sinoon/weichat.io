/**
 * Created by sinoon on 15/8/18.
 */

var wechat = require('wechat');
var request  = require('request');

var robotUrl = 'http://www.tuling123.com/openapi/api';
var robotKey = '11607077906726b66072dda871205cd6';

var config = {
	token:'123abc',
	appid:'wx6ec63f5b355e74fb'
};

module.exports = wechat(config,function ( req,res,next ) {
	var message = req.weixin;

	var content = message.Content;

	console.log(message);
	console.log(content);

	request.get(robotUrl,{
		key:robotKey,
		info:content
	}, function ( error,resopnse,body ) {
		console.log(body);
		res.reply(body)
	})
});