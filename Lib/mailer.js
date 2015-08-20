/**
 * Created by sinoon on 15/8/18.
 */

var nodemailer = require('nodemailer');

var config = {
	user:'shangnan@qwbcg.com',
	pass:'xxsnkkll1218'
};

var transport = nodemailer.createTransport({
	service:'QQex',
	auth : {
		user : config.user,
		pass : config.pass
	}
});

module.exports = function ( form,to,subject,text,callback ) {
	transport.sendMail({
		from:form,
		to:to,
		subject:subject,
		text:text
	}, function ( err,info ) {

		console.log(err,info);

		return callback(err,info)
	})
};