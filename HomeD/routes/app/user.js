var express = require('express');
var fbgraph = require('fbgraph');

var router = express.Router();
var db = require('../../models/app/db_user');
var multer = require('../multerSet');
var upload = multer.multerSet();
var presettings = require('../../models/presettings');
var passport = require('passport'),
		KakaoStrategy = require('passport-kakao').Strategy;

/* GET users listing. */
router.get('/',upload.array(),  function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', upload.array(),  function (req, res) {
	var userName = req.body.userName;
	var userNick = req.body.userNick;
	var userEmail = req.body.userEmail;
	var userPw = req.body.userPw;
	var datas = [userEmail, userName, userNick, userPw];
	db.signup (datas, function (results) {
	 	res.json( results );
	});
});

router.post('/login', upload.array(), function ( req, res) {
	var userEmail = req.body.userEmail;
	var userPw = req.body.userPw;

	var datas = [userEmail, userPw];

	db.login (datas, function (results) {
		req.session.userNo = results.results.userNo;
		res.json( results );
	});
});

//가입시 유저 이메일 존재 유무 체크
router.get('/emailCheck/:email', upload.array(),  function (req, res) {
	var email = req.params.email;

	db.emailCheck (email, function (results) {
		res.json(results);
	})
});

//가입시 유저 닉네임 존재 유무 체크
router.get('/nickCheck/:nick', upload.array(),  function (req, res) {
	var nick = req.params.nick;
	db.nickCheck (nick, function (results) {
		res.json(results);
	})
});

router.post('/facebook', upload.array(),  function (req, res) {
	var fbToken = req.body.fbToken;
	fbgraph.setAccessToken(fbToken);
	fbgraph.get('/me', function ( fbErr, fbRes ) {
		if(fbErr) {
			console.error('fbErr ', fbErr);
			res.json();
		} else {
			fbgraph.get('/me?fields=picture', function ( fbPErr, fbPRes ) {
				if(fbPErr) {
					console.error('fbPErr = ', fbPErr);
					var callbackDatas = {};
					callbackDatas.message = "login fail";
					callbackDatas.success = 3;
					callback.results = {
						"userNo" : 0, "userEmail" : "~~", "userNick" : "0"
					}
					res.json(callbackDatas);
				} else {
					fbRes.image = fbPRes.picture.data.url;
					console.log('fbRes = ', fbRes);
					db.fbLogin( fbRes, function (results){
						req.session.userNo = results.results.userNo;
						res.json(results);
					});
				}
			});
		}
	});
});

router.post('/kakao', upload.array(),  function (req, res) {
	var kakao_id = req.body.kakao_id;
	var userNick = req.body.userNick;
	var profilePath = req.body.profilePath;
	var datas = [kakao_id,userNick, profilePath];
	db.kakao(datas, function (results) {
		req.session.userNo = results.results.userNo;
		res.json(results);
	});
});


module.exports = router;
