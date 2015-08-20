/**
 * Created by sinoon on 15/8/3.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('testBridge');
});

router.get('/testCss', function (req,res,next) {
    res.render('testCss')
});

router.get("/testRefresh", function (req,res,next) {
    res.render('testRefresh')
});

router.get("/testCopyToQQ", function (req,res,next) {
    res.render("testCopyToQQ")
});

router.get("/testAbsolute", function ( req,res ) {
	res.render("test/testAbsolute")
});

module.exports = router;
