var express = require('express');
var router = express.Router();
var db = require('../../models/app/db_post');
var multer = require('../multerSet');
var upload = multer.multerSet();

router.post('/', upload.array('postImages', 15), function (req, res) {
	var images = req.files;
	var tags = req.body.postTags;
	tags = tags.substr(1);
	var tagArray = tags.split('#');
	var contents = req.body.postContents;
	var userNo = req.session.userNo;
	// var userNo = 11;
	var datas = [userNo, tagArray, contents, images];
	console.log('datas = ', datas);
	db.Createpost(datas, function (results ){
		res.json(results);
	});
});

router.post('/del', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 11;
	var postNo = req.body.postNo;
	console.log('req.body=',req.body)

	db.delPost(postNo, userNo, function (results) {
		console.log('results- ', results);
		res.json(results);
	});
});

router.get('/viewDetails/:postNo', upload.array(), function (req, res, next) {
	var userNo = req.session.userNo;
	// var userNo = 11;
	var postNo = req.params.postNo;
	db.viewDetails(userNo,postNo, function (results) {
		res.json(results);
	});
});

router.post('/like', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 11;
	var postNo = req.body.postNo;

	db.doLike(userNo, postNo, function (results ){
		res.json(results);
	});
});

router.get('/viewComments/:postNo/:page', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	var postNo = req.params.postNo;
	var page = req.params.page;

	db.viewComments(postNo, page, function (results ){
		res.json(results);
	});
});

router.post('/comments', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 11;
	var postNo = req.body.postNo;
	var contents = req.body.contents;
	var datas = [contents, userNo, postNo];
	db.comments(datas, function(results) {
		res.json(results);
	});
});

router.get('/purchase/:postNo', upload.array(), function (req, res) {
	var postNo = req.params.postNo;

	db.purchaseList(postNo, function (results) {
		res.json(results)
	});
});

module.exports = router;
