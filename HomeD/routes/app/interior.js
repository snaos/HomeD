var express = require('express');
var router = express.Router();
var db = require('../../models/app/db_interior');
var multer = require('../multerSet');
var upload = multer.multerSet();

//'인테리어 하기' 수행 시 이미지 전송
router.get('/', upload.array(), function (req, res, next) {
	db.interiorStart( function (results) {
		res.json(results);
	});
});

router.get('/room', upload.array(), function (req, res, next) {
	db.interiorRoomImg( function (results) {
		res.json(results);
	});
});

router.get('/select/:page', upload.array(), function (req, res) {
	var page = req.params.page;

	db.selectImages( page, function (results) {
		res.json(results);
	});
});

//'인테리어 하기' 결과
/*
interiorType : ‘디자인’인지 ‘시공’인지 확인
interiorInfo : 인테리어에 관련 정보
(ex. 룸정보(living)-2_룸정보(living)-10 / 예산안 / 주거구분)
interiorUserInfo : 고객 정보
(ex. 김성환/–시_—구/핸드폰번호)
interiorImages : 선택한 이미지
(ex. 경로/경로/경로)
*/
router.post('/', upload.array(), function (req, res, next) {
  var interiorType = req.body.interiorType;
  var interiorInfo = req.body.interiorInfo;
  var interiorUserInfo = req.body.interiorUserInfo;
  var interiorImages = req.body.interiorImages;
  var userNo = req.session.userNo;
  // var userNo = 1;
  var datas = [interiorType, interiorInfo, interiorUserInfo,interiorImages];
  db.interiorEnd(datas, userNo, function (results) {
  	res.json(results);
  });
});

router.get('/wishList/:page', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	var page = req.params.page;
	// var userNo = 1;
	db.wishList(userNo,page, function (results) {
		res.json(results);
	});
});

//-------------------------------------------------------------

router.get('/interiorList/:page', upload.array(), function (req, res) {
	var userNo = req.session.userNo;
	// var userNo = 1;
	var page = req.params.page;
	db.interiorList (userNo, page, function (results){
		res.json(results);
	});
});

router.get('/wishList/detail/:interiorNo', upload.array(), function (req, res ){
	var userNo = req.session.userNo;
	// var userNo = 1;
	var interiorNo = req.params.interiorNo;
	db.wishListDetail(userNo, interiorNo, function (results) {
		res.json(results);
	});
});

// ---------------------------------------------------------------------------
router.get('/category', upload.array(), function (req, res) {
	db.category(function (results) {
		res.json(results);
	});
});

router.post('/category', upload.array(), function (req, res) {
	var category = req.body.category;
	db.categoryResults( category, function (results) {
		res.json(results);
	});
});

module.exports = router;
