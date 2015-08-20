/**
 * Created by sinoon on 15/8/18.
 */

var request = require( 'request' );
var config = require( '../Config/robot' );

module.exports = function ( content , callback ) {

	request.get( {
		url: config.url ,
		qs: {
			key: config.key ,
			info: content
		}
	} , function ( error , response , body ) {
		if ( error ) {
			return callback( error );
		}

		try{
			body = JSON.parse(body)
		}catch(e){
			// TODO: Handle error
		}

		return callback( null , body )
	} )

};