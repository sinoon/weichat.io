var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var session = require( 'express-session' );
var RedisStore = require( 'connect-redis' )( session );
var Redis = require( 'ioredis' );
var assets = require( 'connect-assets' );

// 路由
var routes = require( './routes/index' );
var users = require( './routes/users' );
var test = require( './routes/test' );
var inter = require( './routes/interface' );
var wechat = require( './routes/wechat' );
var update = require('./routes/update');

var redis = new Redis();

var app = express();

// 设置为生产模式
//app.set('env','production');

// view engine setup
app.set( 'views' , path.join( __dirname , 'views' ) );
app.set( 'view engine' , 'jade' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );

// 设置session
var sessionConfig = {
	client: redis
};
app.use( session( {
	store: new RedisStore( sessionConfig ) ,
	secret: "I love Mao",
	resave:false,
	saveUninitialized:false
} ) );

// 设置静态文件
app.use( assets( {
	paths: [ 'public/css' , 'public/js' , 'public/img' ],
	fingerprinting:true,
	build:true,
	buildDir:"builtAssets",
	compress:true
} ) );

// 由于assets存在，这条基本不存在
app.use( express.static( path.join( __dirname , 'public' ) , { maxAge: 31557600000 , lastModified: false } ) );

// 主页
app.use( '/' , routes );

// 用户页面
app.use( '/users' , users );

// 测试页面
app.use( '/test' , test );

// 测试使用的转发接口页面
app.use( '/interface' , inter );

app.use( express.query() );
// wechat
app.use( '/wechat' , wechat );

app.use('/update',update);

// catch 404 and forward to error handler
app.use( function ( req , res , next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next( err );
} );

// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
	app.use( function ( err , req , res , next ) {
		res.status( err.status || 500 );
		res.render( 'error' , {
			message: err.message ,
			error: err
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err , req , res , next ) {
	res.status( err.status || 500 );
	res.render( 'error' , {
		message: err.message ,
		error: {}
	} );
} );


module.exports = app;
