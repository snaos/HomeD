var express = require('express');
var router = express.Router();
var multer = require('../multerSet');
var nodemailer = require('nodemailer');
var upload = multer.multerSet();

var db_app_interior = require('../../models/app/db_interior');
var db = require("../../models/homepage/db_main");

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'snaos0607@gmail.com',
        pass: 'forhomed'
    }
});


router.get('/', upload.array(), function (req, res, next) {
		res.redirect("http://www.homed.co.kr/doInterior/1");
});


router.get('/apply', upload.array(), function (req, res, next) {
		res.render('homepage_v2/v2_apply');
});

router.post('/apply', upload.array(), function (req, res, next) {
	var reqDatas = req.body;
	console.log("reqDatas = ", reqDatas)
	db.do_interior_apply_data_save(reqDatas, function (results) {
		res.json('data');
		console.log("results",results);
		var mailOptions = {
		    from: '<homed>',
		    to: 'snaos1@homed.co.kr, comengineer12@homed.co.kr, hkworld12@homed.co.kr, hdesigner@homed.co.kr',
		    // to: 'snaos1@homed.co.kr',
		    subject: 'homed 인테리어 신청',
		    text: 'homed',
		    html: '홈디의 인테리어 신청 <br> <br>' + '서비스 종류 : ' + results[0] + '<br><br> 이사 유무 :  ' + results[2] + '<br> 건물형태 :  ' + results[6] + ' <br> 시공 유무(construction = 간단시공) :  ' + results[7] + '<br> 방 정보 :  ' + results[8] + '<br> 이름 :  ' + results[11] + '<br> 나이 : ' + results[12] + ' <br> 성별 : ' + results[13] + ' <br> 직업 : ' + results[14] + ' <br> 메일 : ' + results[15] + '<br> 주소 :  ' + results[16] +' <br> 연락처 : ' + results[17] + '<br> 희망전화시간 :  ' + results[18] +'<br> 예산안 :  ' + results[19] +'<br> 메시지 :  ' + results[21] + '<br>'
		};
		transporter.sendMail(mailOptions, function (error, info) {
		    if (error) {
		      	console.error(error);
		    } else {
		    }
		});
	})
});

router.get('/apply/result', upload.array(), function (req, res, next) {
		res.render('homepage_v2/v2_apply_result');
});

router.get('/:service', upload.array(), function (req, res, next) {
	var service = req.params.service
	if(service == 1 ||service == 2 ) {
		db_app_interior.selectImages(1, function (results) {
			res.render('homepage_v2/doInterior', {"roomInspiration" : results.results, "service" : service});
		});
	} else {
		res.redirect("http://www.homed.co.kr/");
	}
});
router.get('/select/:page',upload.array(), function (req, res, next ) {
	var page = req.params.page;
	db_app_interior.selectImages(page, function (results) {
		res.json({"roomInspiration" : results.results, "success" : results.success});
	});
})

router.post('/request',upload.array(), function (req, res, next ) {
	var interiorDatas = req.body;
	var bodyKeys = Object.keys( interiorDatas);
	db.requestInterior (req.body, function (results) {
		res.json(results);
		var mailOptions = {
		    from: '<homed>',
		    to: 'snaos1@homed.co.kr, comengineer12@homed.co.kr, hkworld12@homed.co.kr, hdesigner@homed.co.kr',
		    // to: 'snaos1@homed.co.kr',
		    subject: '인테리어 신청',
		    text: 'homed',
		    html: '홈디의 인테리어 신청 <br> <br>' + '방 정보 : ' + interiorDatas[bodyKeys[0]] + '<br><br> 유저 이름 :  ' + interiorDatas[bodyKeys[2]] + '<br> 유저 예산안 :  ' + interiorDatas[bodyKeys[3]] + ' <br> 유저 주거 형태 :  ' + interiorDatas[bodyKeys[4]] + '<br> 주소 :  ' + interiorDatas[bodyKeys[5]] + '<br> 핸드폰 :  ' + interiorDatas[bodyKeys[6]] + '<br> 이메일 : ' + interiorDatas[bodyKeys[7]] + ' <br> 메시지 : ' + interiorDatas[bodyKeys[8]] + ' <br> 오프라인 유무 : ' + interiorDatas[bodyKeys[9]] + ' <br> 컨셉 정보 : ' + interiorDatas[bodyKeys[10]] + '<br> 신청 타입 :  ' + interiorDatas[bodyKeys[11]] +' <br> 나이 : ' + interiorDatas[bodyKeys[12]] + '<br> 유입 경로 :  ' + interiorDatas[bodyKeys[13]] +'<br>'
		};
		transporter.sendMail(mailOptions, function (error, info) {
		    if (error) {
		      	console.error(error);
		    } else {
		    }
		});
	});
});

router.get('/getConceptImages/:concept',upload.array(), function (req, res, next ) {
	var concept = req.params.concept;
	db.getConceptImages(concept, function (results) {
		res.json({"conceptImages" : results.results, "success" : results.success});
	});
});

module.exports = router;
