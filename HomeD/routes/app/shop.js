var express = require('express');
var router = express.Router();
var db = require('../../models/app/db_shop');
var multer = require('../multerSet');
var upload = multer.multerSet();


router.get('/:page', upload.array(),  function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;
	var page = req.params.page;
	db.shopList( userNo, page,function (results) {
		res.json(results);
	})
});

router.get('/:shopNo/goods/:page', upload.array(),  function (req, res) {
	var shopNo = req.params.shopNo;
	var userNo = req.session.userNo;
	// var userNo = 1;
	var datas = [userNo, shopNo];
	var page = req.params.page;
	db.shopGoods( datas,page, function (results) {
		res.json(results);
	})
});

router.post('/like', upload.array(), function (req, res) {
	var goodsNo = req.body.goodsNo;
	var userNo = req.session.userNo;
	// var userNo = 1;
	var datas= [userNo, goodsNo];
	db.goodsLike(datas, function (results ) {
		res.json(results);
	});
});

router.get('/like/:goodsNo', upload.array(), function (req, res) {
	var goodsNo = req.params.goodsNo;
	var userNo = req.session.userNo;
	// var userNo = 1;
	var datas= [userNo, goodsNo];
	db.goodsLikeStatus(datas, function (results ) {
		res.json(results);
	});
});

router.get('/likeList/:page', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;
	var page = req.params.page;
	db.likeList(userNo, page, function (results) {
		res.json(results);
	})
});

router.post('/favorite', upload.array(), function (req, res) {
	var shopNo = req.body.shopNo;
	var userNo = req.session.userNo;
	// var userNo = 1;
	var datas= [userNo, shopNo];
	db.shopFavorite(datas, function (results ) {
		res.json(results);
	});
});

router.get('/favorite/:shopNo', upload.array(), function (req, res) {
	var shopNo = req.params.shopNo;
	var userNo = req.session.userNo;
	// var userNo = 1;
	var datas= [userNo, shopNo];
	db.shopFavoriteStatus(datas, function (results ) {
		res.json(results);
	});
});

router.get('/favoriteList/:page', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;
	var page = req.params.page;

	db.favoriteList(userNo, page,function (results) {
		res.json(results);
	})
});

module.exports = router;
