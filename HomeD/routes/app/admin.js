	var express = require('express');
var router = express.Router();
var multer = require('../multerSet');
var upload = multer.multerSet();
var db = require('../../models/app/db_admin');
/* GET home page. */

router.post('/post', upload.array('postImages', 15), function ( req, res, next) {
	var images = req.files;
	var postImageInfo = req.body.postImageInfo;



});


router.post('/product', upload.array('productImage', 15), function ( req, res, next) {
	var images = req.files;
	var productInfo = req.body.postImageInfo;
	var productPrice = req.body.productPrice;
	var productNm = req.body.productNm;
	var datas = [productNm, productInfo, productPrice ];

	db.productUpload(datas, images, function (results) {
		res.json(results);
	});
});

module.exports = router;
