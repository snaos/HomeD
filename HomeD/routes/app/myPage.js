var express = require('express');
var router = express.Router();
var db = require('../../models/app/db_myPage');
var multer = require('../multerSet');
var upload = multer.multerSet();

//마이페이지 접속 페이지
router.get('/',upload.array(),  function (req, res, next) {
	var userNo = req.session.userNo;
	// var userNo = 1
	db.myPage(userNo, function (results) {
		res.json(results);
	});
});

//마이페이지 내가 올린 글
router.get('/myPosts/:page', upload.array(), function (req, res, next) {
	var userNo = req.session.userNo;
	// var userNo = 11;
	var page = req.params.page;
	var datas = [userNo, page];
	db.myPosts(datas, function (results) {
		res.json(results);
	});
});

//마이페이지 내가 좋아요 한 글
router.get('/myLikes/:page',upload.array(),  function (req, res, next) {
	var userNo = req.session.userNo;
	// var userNo = 11;
	var page = req.params.page;
	var datas = [userNo, page];
	db.myLikes(datas, function (results) {
		res.json(results);
	});
});

router.get('/myInfo',upload.array(),  function (req, res, next) {
	var userNo = req.session.userNo;
	// var userNo = 1;

	db.myInfoGet(userNo, function (results) {
		res.json(results);
	});
});

router.post('/myInfo', upload.single('userImage'), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;
	var userGender = req.body.userGender;
	var userBirth = req.body.userBirth;
	var userPhone = req.body.userPhone;
	var userNick = req.body.userNick;
	var userAdd = req.body.userAdd;
	var userInfo = req.body.userInfo;
	var image = req.file;
	var imageUrl = req.body.imageUrl;
	var datas = [userGender, userBirth, userPhone, userNick, userAdd, userInfo, image, userNo];
	db.myInfoPost(datas,imageUrl, function (results) {
		res.json(results);
	});
});

router.get('/log/:page', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;
	var page = req.params.page;
	db.myLog(userNo, page, function (results) {
		res.json(results);
	});
});

module.exports = router;
