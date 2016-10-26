var express = require('express');
var router = express.Router();
var multer = require('../multerSet');
var upload = multer.multerSet();
var db = require('../../models/homepage/db_question');


//질문 게시판
router.get('/board', upload.array(), function (req, res, next) {

	db.questionList(1, function ( results ) {

		if(results.success == 0) {
			res.redirect("http://www.homed.co.kr/");
		} else if(results.success == 2) { //page over
			res.redirect("http://www.homed.co.kr/");
		} else {

			res.render('homepage/question_list', {
				"pageDatas": results.pageDatas,
				"totalPage" : results.totalPage,
				"startPage" : results.startPage,
				"endPage" : results.endPage,
				"pageNo" : 1,
				"questionPage" : 0,
				"pageSize" : 10
			});
		}
	})
});

//질문게시판 페이지
router.get('/board/:page', upload.array(), function (req, res, next) {
	var page = req.params.page;
	db.questionList(page, function ( results ) {
		if(results.success == 0) {
			res.redirect("http://www.homed.co.kr/");
		} else if(results.success == 2) { //page over
			res.redirect("http://www.homed.co.kr/");
		} else {
			results.questionPage = 1;
			res.render('homepage/question_list', {
				"pageDatas": results.pageDatas,
				"totalPage" : results.totalPage,
				"startPage" : results.startPage,
				"endPage" : results.endPage,
				"pageNo" : page,
				"questionPage" : 1,
				"pageSize" : 10
			});
		}
	})
});

//질문 게시판 글 클릭시
router.get('/board/read/:questionNo', upload.array(), function (req, res ,next) {
	var questionNo = req.params.questionNo;
	res.render('homepage/question_confirm_password', {
		"questionNo" : questionNo
	});
});

router.post('/board/read/:questionNo', upload.array(), function (req, res ,next) {
	var questionNo = req.params.questionNo;
	var pw = req.body.pw;
	db.questionRead (questionNo, pw, function (results) {
		if(results.success == 1) {
			console.log("results = " , results);
			res.render('homepage/question_read', results.results);
		} else {
			res.render('homepage/question_pw_fail');
		}

	});
});


//질문 게시판 글 쓰기

//질문 게시판 글 수정

//질문 게시판 글 삭제

//질문 게시판 글 수정

//FAQ 게시판
router.get('/FAQ', upload.array(), function (req, res, next) {
	res.render('homepage_v2/v2_question');
});

module.exports = router;
