var express = require('express');
var router = express.Router();
var db = require('../../models/app/db_product');
var multer = require('../multerSet');
var upload = multer.multerSet();

router.get('/productInfo/:productNo', upload.array(), function (req, res) {
	var productNo = req.params.productNo;
	db.productInfo (productNo, function (results) {
		res.json(results);
	});
});

router.post('/cart', upload.array(), function (req, res) {
	var productNo = req.body.productNo;
	var userNo = req.session.userNo;
	// var userNo = 1;
	var productCount = req.body.productCount;

	db.addCart (productNo, userNo, productCount, function (results) {
		res.json(results);
	});
});

router.get('/cart/:page', upload.array(), function (req, res) {
	var page = req.params.page;
	var userNo = req.session.userNo;
	// var userNo = 1;

	db.viewCart (userNo, page, function (results) {
		res.json(results);
	});
});

router.get('/myDeliveryInfo', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;

	db.myDInfo ( userNo, function (results ){
		res.json(results);
	});
});

router.post('/purchase', upload.array(), function (req, res) {
	var userNm = req.body.userNm;
	var userAdd = req.body.userAdd;
	var userPhone = req.body.userPhone;
	var price = req.body.price;
	var list = req.body.list;
	var userNo = req.session.userNo;
	// var userNo = 1;

	var datas = [userNo, userNm, userAdd, userPhone, price, list];

	db.purchaseInfo(datas, function (results) {
		res.json(results);
	});
});

router.get('/purchase/:page', upload.array(), function (req, res) {
	var page = req.params.page;
	var userNo = req.session.userNo;
	// var userNo = 1;

	db.purchaseList(userNo, page, function (results) {
		res.json(results);
	});
});

router.post('/decision', upload.array(), function (req, res) {
	var products = req.body.products;
	db.productsInfo(products, function (results){
		res.json(results);
	})
});

module.exports = router;
