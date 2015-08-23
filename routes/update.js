/**
 * Created by sinoon on 15/8/23.
 */

var express = require('express');
var router = express.Router();

var shell = require('shelljs');
var crypto = require('crypto');

router.post('/', function ( req,res,next ) {

	console.log(req);


	var hmac = crypto.createHmac('sha1','abcdefg');
	hmac.update(JSON.stringify(req.body));
	console.log(req.body);
	var signature = 'sha1=' + hmac.digest('hex');

	var _signature = req.headers['x-hub-signature'];

	console.log(signature);
	console.log(_signature);

	if(req.headers['x-hub-signature'] != signature){
		console.log('匹配失败');
		return res.end()
	}

	res.end('ok');

	shell.pwd();
	shell.exec('git pull');
	shell.exec('pm2 restart all')

});

module.exports = router;