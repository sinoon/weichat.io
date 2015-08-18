/**
 * Created by sinoon on 15/8/18.
 */

var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
	use_authentication : true,
	host : 'smtp.qq.com',
	port : 25,
	ssl : true,
	auth : {
		user : "shangnan@qwbcg.com",
		pass : "xxsnkkll1218"
	}
});

module.exports = function ( form,to,subject,text,callback ) {
	transport.sendMail({
		form:form,
		to:to,
		subject:subject,
		text:text
	}, function ( err,info ) {

		console.log(err,info);

		return callback(err,info)
	})
};