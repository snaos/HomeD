var express = require('express');
var router = express.Router();
var db = require('../../models/app/db_search');
var multer = require('../multerSet');
var upload = multer.multerSet();


// sns 태그 검색.
router.get('/sns/:keyword/:page', upload.array(), function (req, res, next) {
	var keyword = req.params.keyword;
	var page = req.params.page;
	var userNo = req.session.userNo;
	// var userNo = 1;
	db.tagSaerchKeyword(userNo, keyword,page, function (results){
		res.json(results);
	});
});

router.get('/shop/:keyword/:page', upload.array(), function (req, res, next) {
	var keyword = req.params.keyword;
	var page = req.params.page;
	var userNo = req.session.userNo;
	// var userNo = 1;
	db.shopSaerchKeyword(userNo, keyword,page, function (results){
		res.json(results);
	});
});

router.get('/product/:keyword/:page', upload.array(), function (req, res, next) {
	var keyword = req.params.keyword;
	var page = req.params.page;
	var userNo = req.session.userNo;
	// var userNo = 1;
	db.goodsSaerchKeyword(userNo, keyword,page, function (results){
		res.json(results);
	});
});


module.exports = router;
