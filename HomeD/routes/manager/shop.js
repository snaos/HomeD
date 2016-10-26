var express = require('express');
var router = express.Router();
var db = require('../../models/web_shop/db_webShop');
// var homedDriver = request('../../models/web_shop/homedDriver');
var dbPost = require('../../models/app/db_post');
var multer = require('../multerSet');
var upload = multer.multerSet();
var fs = require('fs-extra');

var pwValue = 'homed0314';
//기본 페이지
router.post('/', upload.array(), function (req, res, next) {
	if(req.session.loginInfo==true || (req.body.key1 == 'carvazo')&& (req.body.key2 == 'theworks')) {
		req.session.loginInfo =true;
		res.render('shop/index', {title : '홈디', message : ''});
	} else {
		req.session.loginInfo = false;
		res.render('shop/login', {title : '홈디 확인', message : '틀렸어용'});
	}
});

router.get('/', upload.array(), function (req, res, next) {
	if(	req.session.loginInfo==true) {
		res.render('shop/index', {title : '홈디', message : ''});
	} else {
		req.session.loginInfo = false;
		res.render('shop/login', {title : '홈디 확인', message : ''});
	}
});

// //쇼핑몰 추가 페이지
// router.get('/addShop', upload.array(), function (req, res, next) {
// 	res.render('shop/addShop', {title : '쇼핑몰 추가', message : ''});
// });

// //쇼핑몰 추가하기
// router.post('/addShop', upload.array('shopImg', 2), function (req, res, next) {
// 	var pw = req.body.pw
// 	var shopNm = req.body.shopNm
// 	var shopInfo = req.body.shopInfo
// 	var shopUrl = req.body.shopUrl;
// 	var shopENm = req.body.shopENm;
// 	var image = req.files;

// 	if(pw != pwValue){
// 		res.render('shop/error', {message : '비밀번호 불일치'});
// 	} else {
// 		var datas = [shopNm, shopInfo, shopUrl, shopENm];
// 		db.addShop(datas, image, function (results ){
// 			if(results.success = 1){
// 				res.render('shop/index', {title:'홈디 admin', message : '쇼핑몰 추가 성공'})
// 			} else {
// 				res.render('shop/error', {message : results.message});
// 			}
// 		});
// 	}
// });


// //쇼핑몰 상품 추가 페이지
// router.get('/addGoods', upload.array(), function (req, res, next) {
// 	db.getShopInfo(function (results ){
// 		if(results.success==1){
// 			res.render('shop/addGoods', {title : '상품 추가하기', message : '', results : results.results});
// 		} else {
// 			res.render('shop/error', {message : results.message});
// 		}
// 	});
// });

// //쇼핑몰 상품 추가
// router.post('/addGoods', upload.single('goodsImg'), function (req, res, next) {
// 	var goodsNm = req.body.goodsNm;
// 	var goodsPrice = req.body.goodsPrice;
// 	var goodsUrl = req.body.goodsUrl;
// 	var shopNo = req.body.shopNo;
// 	var image = req.file;
// 	var pw = req.body.pw;
// 	if(pw != pwValue){
// 		res.render('shop/error', {message : '비밀번호 불일치'});
// 	} else {
// 		var datas = [goodsNm, goodsPrice, goodsUrl,shopNo];
// 		db.addGoods(datas,image, function (results ){
// 			if(results.success ==1){
// 				res.render('shop/index', {title:'홈디 admin', message : '쇼핑몰 상품 추가 성공'})
// 			} else {
// 				res.render('shop/error', {message : results.message});
// 			}
// 		});
// 	}


// });

//인테리어 요청 확인 페이지
router.get('/interiorRequestList', upload.array(), function (req, res, next) {
	if(req.session.loginInfo==true) {
		res.redirect('/interiorRequestList/1');
	} else {
		res.redirect('/');
	}
});
router.get('/interiorRequestList/:page', upload.array(), function (req, res, next) {

	if(req.session.loginInfo==true) {
		var page = req.params.page;
			page=parseInt(page,10);//해석하여 읽어 숫자로 변경
			db.RequestList(page,function (results){
				res.render('shop/interiorList/interiorList', {title : '인테리어 리스트', message : '', results : results.results, datas : results.datas});
			});
	} else {
		res.redirect('/');
	}
});
router.get('/interiorRequestList/user/:userNo', upload.array(), function (req, res, next) {
	var userNo = req.params.userNo;
	if(req.session.loginInfo) {
		db.requestUserInfo(userNo, function (results) {
		console.log(results);
		var tempString =  results.results.spaceInfo;
		console.log("tempString = ", tempString)
		var tempSpaceInfo = tempString.split('/');
		results.results.spaceInfo = '';
		for( var i = 0; i < tempSpaceInfo.length; i++ ) {
			results.results.spaceInfo += tempSpaceInfo[i]+'<br>';
		}



		res.render('shop/interiorList/interiorInfo', {title : '인테리어 리스트', message : '', results : results.results, 'interiorImages': results.interiorImages, 'interiorRoomImages' : results.interiorRoomImages, 'userNo' : userNo});
		});
	} else {
		res.redirect('/');
	}
});

router.get('/user/consulting/:userNo', upload.array(), function (req, res, next) {
	var userNo = req.params.userNo;
	if(req.session.loginInfo==true) {
		db.requestUserInfo(userNo, function (results) {
		res.render('shop/interiorList/interiorConsulting', {title : '인테리어 리스트', message : '', results : results.results, 'interiorImages': results.interiorImages, 'interiorRoomImages' : results.interiorRoomImages, 'userNo' : userNo});
		});
	} else {
		res.redirect('/');
	}
});

router.post('/user/consulting/:userNo', upload.array(), function (req, res, next) {
	var datas = [req.body.contractors, req.body.userAddress,  req.body.offline, req.body.funnel, req.body.manager, req.body.managerPhone, req.body.spaceNo,req.body.interiorEstimate, req.body.stylingPeriod,  req.body.interiorFlowStatus, req.body.userInfo,  req.params.userNo ]
	if(req.session.loginInfo==true) {
		db.requestUserInfoUpdate(datas, function (results) {
			res.redirect("/v1/web/interiorRequestList/user/"+ req.params.userNo);
		});
	} else {
		res.redirect('/');
	}
});
// //sns 글 올리기
// router.get('/uploadSns/:img', upload.array(), function (req, res ,next) {
// 	var imgNo = req.params.img;

// 	res.render('shop/sns/uploadSNS', {title : 'sns 업로드', message : '', imgNo : imgNo});
// });

// router.post('/uploadSnsContents', upload.array('postImages', 15), function (req, res ,next) {
// 	if(req.body.pw!=pwValue){
// 			res.render('shop/error', {message : '비밀번호 불일치'});
// 	} else {
// 		var contents = req.body.postContents;
// 		var tags = req.body.postTags;
// 		tags = tags.substr(1);
// 		var tagArray = tags.split('#');
// 		var images = req.files;
// 		var userNo = req.body.userNo;
// 		var datas = [userNo, tagArray, contents, images];
// 		dbPost.Createpost(datas, function (results){
// 			res.redirect('/v1/web/');
// 		});
// 	}
// });

// router.get('/uploadSelectImg', upload.array(), function (req, res,next) {
// 	res.redirect('/v1/web/uploadSelectImg/1')
// 	//res.render('shop/uploadSelectImage', {title : 'select 사진 upload', num : 1});
// });

// router.get('/uploadSelectImg/:num', upload.array(), function (req, res,next) {
// 	var num = req.params.num;
// 	res.render('shop/uploadSelectImage', {title : 'select 사진 upload', num : num});
// });

// router.post('/uploadSelectImg', upload.array('img', 20), function (req, res,next) {
// 	if(req.body.pw!=pwValue){
// 			res.render('shop/error', {message : '비밀번호 불일치'});
// 	} else {
// 		var img = req.files;
// 		db.SelectImg(img, function (results ){
// 			if(results.success = 1){
// 				res.redirect('/v1/web/');
// 			} else {
// 				res.render('shop/error', {message : 'insert error'});
// 			}
// 		});
// 	}
// });
// router.get('/homed-driver', upload.array(), function (req, res, next) {
// 	if(req.session.loginInfo==true) {
// 		homedDriver.driver(
// 			res.render('shop/interiorList/homedDriver');
// 		);
// 	} else {
// 		res.redirect('/');
// 	}
// });

module.exports = router;
