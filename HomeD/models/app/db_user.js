var mysql = require('mysql');
var crypto = require('crypto');
var fs = require('fs-extra');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);
var iterations = 1000;	//암호화 반복 횟수
var keylen = 24;    //암호화 후 생성되는 key 길이 설정

var pwCrypto = function ( userPw ) {
	userPw = userPw + '';

	var salt = Math.round( (new Date().valueOf() * Math.random())) + '';
	var key = crypto.pbkdf2Sync(userPw, salt, iterations, keylen);
	var pw_cryp = Buffer(key, 'binary').toString('hex');

	var results = {
		"pw" : pw_cryp,
		"salt" : salt
	}
	return results;
}

var pwDecrypto = function ( input, userPw, userSalt) {
	input = input + '';
	var key = crypto.pbkdf2Sync(input, userSalt, iterations, keylen);
	var pw_cryp = Buffer(key, 'binary').toString('hex');
	if ( pw_cryp == userPw )
		return true;
	else
		return false;
}

// datas =  [userEmail, userName, userNick, userPw];
exports.signup = function (datas, callback) {
	var callbackDatas = {};
	var signupSQL = 'INSERT INTO USERS(USERS_EMAIL, USERS_NM, USERS_NICK, USERS_PW, USERS_SALT, USERS_SIGNUP_TIME, USERS_BIRTH, USERS_IMG_PATH, USERS_PHONE,USERS_GENDER) VALUES (?,?,?,?,?,now(),?,?,?,?)';

	pool.getConnection ( function (connErr, conn) {
 		if(connErr) {
 			console.error('connErr = ', connErr );
	 		callbackDatas.message = "get Connection error";
	 		callbackDatas.results = {"userNo" : 0, "userEmail" : datas[0], "userNick" : datas[2]};
	 		callbackDatas.success = 3;
	 		callback(callbackDatas );
	 	} else {
	 		var cryptoResults = pwCrypto (datas[3]);
	 		datas[3] = cryptoResults.pw;
	 		datas.push(cryptoResults.salt);
	 		datas.push('0000-00-00');
	 		datas.push(presetting.defaultIMG());
	 		datas.push('00000000000');
	 		datas.push('N');
	 		conn.query(signupSQL, datas, function (signupErr, signupRow) {
	 			if(signupErr){
	 				console.error('signupErr = ', signupErr);
	 				callbackDatas.message = "signup fail";
	 				callbackDatas.success = 3;
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				conn.query( presetting.lastInsertID(), function (lIIErr, LIIRow) {
	 					//gcm처리
	 					var results = {};
	 					 results.userNo = LIIRow[0].li;
	 					 results.userEmail = datas[0];
	 					 results.userNick = datas[2];
	 					 callbackDatas.success = 1;
	 					 callbackDatas.message = "signup success"
	 					 callbackDatas.results = results;
	 					 conn.release();
	 					 callback(callbackDatas);
	 				});
	 			}
	 		});
	 	}
	});
}

exports.emailCheck = function (email, callback) {
	var callbackDatas = {};
	var emailCheckSQL = "SELECT * FROM USERS WHERE USERS_EMAIL=?";

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
	 		console.error('connErr = ', connErr );
	 		callbackDatas.message = "get Connection error";
	 		callbackDatas.success = 3;
	 		callback(callbackDatas );
	 	} else {
	 		conn.query(emailCheckSQL, email, function (ecErr, ecRow) {
	 			if(ecErr) {
	 				console.error('ecErr ', ecErr);
	 				callbackDatas.message = "email check fail";
	 				callbackDatas.success = 3;
	 				conn.release();
	 				callback(callbackDatas);
	 			} else if( ecRow.length == 0) {
	 				callbackDatas.message = "OK";
	 				callbackDatas.success = 1;
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				callbackDatas.message = "NO";
	 				callbackDatas.success = 1;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	});
}

exports.nickCheck = function (nick, callback) {
	var callbackDatas = {};
	var nickCheckSQL = 'SELECT * FROM USERS WHERE USERS_NICK=?';

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
	 		console.error('connErr = ', connErr );
	 		callbackDatas.message = "get Connection error";
	 		callbackDatas.success = 3;
	 		callback(callbackDatas );
	 	} else {
	 		conn.query(nickCheckSQL, nick, function (ncErr, ncRow) {
	 			if(ncErr) {
	 				console.error('ncErr ', ncErr);
	 				callbackDatas.message = "nick check fail";
	 				callbackDatas.success = 3;
	 				conn.release();
	 				callback(callbackDatas);
	 			} else if( ncRow.length == 0) {
	 				callbackDatas.message = "OK";
	 				callbackDatas.success = 1;
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				callbackDatas.message = "NO";
	 				callbackDatas.success = 1;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	});
}

// datas = [userEmail, userPw];
exports.login = function ( datas, callback ) {
	var callbackDatas = {};
	var findUserSQL = 'SELECT USERS_NO AS userNo, USERS_PW AS userPw, USERS_SALT AS userSalt, USERS_NICK AS userNick FROM USERS WHERE USERS_EMAIL=?';

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
	 		console.error('connErr = ', connErr );
	 		callbackDatas.message = "get Connection error";
	 		callbackDatas.results = {"userNo" : 0, "userEmail" : datas[0], "userNick" : datas[2]};
	 		callbackDatas.success = 3;
	 		callback(callbackDatas);
	 	} else {
	 		conn.query(findUserSQL, datas[0], function (findUserErr, findUserRow) {
	 			if (findUserErr) {
	 				console.error('findUserErr = ', findUserErr)
	 				callbackDatas.message = "login fail";
	 				callbackDatas.success = 3;
	 				callback.results = {
	 					"userNo" : 0, "userEmail" : "~~", "userNick" : "0"
	 				}
	 				conn.release;
	 				callback(callbackDatas);
	 			} else if(findUserRow.length == 0) {
	 				callbackDatas = {
	 					"success" : 2,
	 					"message" : "please confirm your email",
	 					"results" : {
	 						"userNo" : 0, "userEmail" : "~~", "userNick" : "0"
	 					}
	 				}
	 				conn.release;
	 				callback(callbackDatas);
	 			} else if (pwDecrypto( datas[1], findUserRow[0].userPw, findUserRow[0].userSalt ) == true){
 				//비밀번호 맞음.
 				//gcm 처리
 					callbackDatas.message = "login success"
 					callbackDatas.success = 1;
 					callbackDatas.results = {
 						"userNo" : findUserRow[0].userNo,
 						"userEmail" : datas[0],
 						"userNick" : findUserRow[0].userNick
 					}
	 				conn.release;
	 				callback(callbackDatas);
 				} else {		//비밀번호 틀림
 					callbackDatas.message = "please check your password";
 					callbackDatas.success = 2;
 					callbackDatas.results = {
 						"userNo" : findUserRow[0].USERS_NO,
 						"userEmail" : datas[0],
 						"userNick" : findUserRow[0].USERS_NICK
 					}
	 				conn.release;
	 				callback(callbackDatas);
 				}
	 		});
	 	}
	});
}

exports.fbLogin = function (datas, callback) {
	var fbSQL = 'SELECT USERS_NO AS userNo, USERS_EMAIL AS userEmail, USERS_NICK AS userNick FROM USERS WHERE USERS_FB=?';
	var fbInsertSQL = 'INSERT INTO USERS(USERS_NM, USERS_EMAIL, USERS_GENDER, USERS_BIRTH, USERS_FB, USERS_SIGNUP_TIME, USERS_IMG_PATH, USERS_NICK) VALUES(?,?,?,?,?,now(),?,?)'

	if(datas.gender == ' male')
		datas.gender = 'M';
	else
		datas.gender = 'F';
	var callbackDatas = {};
	var date = '0000-00-00';
	var imagePath = './public/uploads/profile/'+datas.id+'_'+Date.now()+'.jpg';
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
			console.error('connErr ', connErr);
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback.results = {
				"userNo" : 0, "userEmail" : "~~", "userNick" : "0"
			}
			callback(callbackDatas);
		} else {
			conn.query(fbSQL, datas.id, function ( fbSqlErr, fbRow) {
				if(fbSqlErr) {
					console.error('fbSqlErr ', fbSqlErr);
					callbackDatas.success = 3;
					callbackDatas.message = 'facebook fail';
					callbackDatas.results = {
						"userNo" : 0, "userEmail" : "~~", "userNick" : "0"
					}
					conn.release;
					callback(callbackDatas);
				} else if(fbRow.length == 0){	//가입 정보 없음. 회원가입.
					presetting.download(datas.image, imagePath, function () {	//이미지 다운로드
						var insertDatas = [datas.name, 'fb_'+Date.now(), datas.gender, date, datas.id, presetting.address()+imagePath.substring(9), 'fb_'+Date.now()];
						conn.query( fbInsertSQL, insertDatas, function ( fbIErr, fbIRow ) {
							if(fbIErr) {	//
								console.error('fbIErr ', fbIErr);
								callbackDatas.success = 3;
								callbackDatas.message = 'facebook fail';
								callbackDatas.results = {
									"userNo" : 0, "userEmail" : "~~", "userNick" : "0"
								}
								conn.release;
								callback(callbackDatas);
							} else {
								conn.query(presetting.lastInsertID(), function (lIIErr, LIIRow) {
									//gcm 처리
									callbackDatas.results = {"userNo" : LIIRow[0].li,
								 		"userEmail" : insertDatas[1],
								 		"userNick" : insertDatas[6]
								 	}
								 	callbackDatas.success = 1;
								 	callbackDatas.message = "facebook success"
								 	conn.release();
								 	callback(callbackDatas);
								});
							}
						})
					});
				} else {	//가입정보 존재. 로그인//
					//gcm처리
 					callbackDatas.message = "facebook success"
 					callbackDatas.success = 1;
 					callbackDatas.results = {
 						"userNo" : fbRow[0].userNo,
 						"userEmail" : fbRow[0].userEmail,
 						"userNick" : fbRow[0].userNick
 					}
	 				conn.release;
	 				callback(callbackDatas);
				}
			});
		}
	});
}

//var datas = [kakao_id,userNick, profilePath];
exports.kakao = function (datas, callback) {
	var kakaoSQL = "SELECT USERS_NO AS userNo, USERS_NICK AS userNick FROM USERS WHERE USERS_KAKAO=?";
	var kakaoInsertSQL = "INSERT INTO USERS(USERS_KAKAO, USERS_NICK, USERS_IMG_PATH, USERS_SIGNUP_TIME, USERS_EMAIL,USERS_NM) VALUES(?,?,?,NOW(),?,?)";
	var callbackDatas = {};
	callbackDatas.message = "kakao fail";
	callbackDatas.results = {     "userNo":0,
	  "userNick":"-"
	};
  callbackDatas.success = 3
	var imagePath = './public/uploads/profile/'+datas[0]+'_'+Date.now()+'.jpg';
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
			console.error('connErr ', connErr);
			callback(callbackDatas);
		} else {
			conn.query(kakaoSQL, datas[0], function (kErr, kRows) {
				if(kErr){
					console.error("kErr = ", kErr);
					conn.release();
					callback(callbackDatas);
				}
				else if(kRows.length == 0) {
					presetting.download(datas.pop(), imagePath, function () {

						datas.push(presetting.address()+imagePath.substring(9));
						datas.push(Date.now());
						datas.push(datas[1]);
						console.log("datas= ",datas);
						conn.query(kakaoInsertSQL, datas, function (kiErr, kiRows) {
							if(kiErr){
								console.error("kiErr = ", kiErr);
								conn.release();
								callback(callbackDatas);
							} else {
								conn.query(presetting.lastInsertID(), function (lIIErr, LIIRow) {
									console.log('LIIRow = ', LIIRow);
									callbackDatas.message = "kakao success";
									callbackDatas.success = 1;
									callbackDatas.results.userNo = LIIRow[0].li;
									callbackDatas.results.userNick = datas[1];
									conn.release();
									callback(callbackDatas);
								});
							}
						});
					});
				} else {
					callbackDatas.message = "kakao success";
					callbackDatas.success = 1;
					callbackDatas.results = {
						"userNo" : kRows[0].userNo,
						"userNick" : kRows[0].userNick
					}
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}