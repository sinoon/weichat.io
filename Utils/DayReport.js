/**
 * Created by sinoon on 15/8/19.
 */

var mailer = require('../Lib/mailer');
var moment = require('moment');

// 设置为中文
moment.locale('zh-cn');
var date = moment().format('LL');
var day = moment().format('DD');

var subject = '商楠' + '-' + '日报' + '-' + date + '-' + day;

var config = {
	from:'shangnan@qwbcg.com',
	to:'luoqibu@qwbcg.com'
};

module.exports = function ( _content , callback ) {

	var content = '';
	_content.forEach( function ( val ,index) {
		content += index + '. ' + val + '\n'
	});

	mailer(config.from,config.to,subject,content, function ( err,result ) {
		if(err){
			console.log(err)
		}

		if(callback){
			return callback(err,result)
		}
	})
};