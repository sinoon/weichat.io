/**
 * Created by sinoon on 15/8/23.
 */

var express = require('express');
var router = express.Router();

var shell = require('shelljs');

router.post('/', function ( req,res,next ) {

	console.log(req);
	res.end('ok');

	shell.pwd();
	shell.exec('git pull');
	shell.exec('pm2 restart all')

});

module.exports = router;