var mysql = require('mysql');
var async = require('async');
var fs = require('fs-extra');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);


exports.myPage = function (userNo, callback) {
	var callbackDatas = {};
	var mypageSQL = 'SELECT USERS_IMG_PATH AS userImage, USERS_NICK AS userNick, USERS_INFO AS userInfo, USERS_EMAIL AS userEmail FROM USERS WHERE USERS_NO=?';
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = {"userNo" : 0, "userEmail" : "email", "userNick" : "nick", "userImage" : "!", "userInfo" : "hi"};
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(mypageSQL, userNo, function (mpErr, mpRow) {
				if(mpErr) {
					console.error('mpErr ', mpErr);
					callbackDatas.message = "my page fail";
					callbackDatas.results = {"userNo" : 0, "userEmail" : "email", "userNick" : "nick", "userImage" : "!", "userInfo" : "hi"};
					callbackDatas.success = 3;
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.message = "my page success";
					callbackDatas.success = 1;
					callbackDatas.results = mpRow[0];
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
};

//datas = [userNo, page]
exports.myPosts = function (datas, callback) {
	var callbackDatas = {};
	var mypostsSQL = "SELECT p.USERS_NO AS userNo,p.POSTS_NO as postNo, p.POSTS_THUMBNAIL as postImage, date_format(p.POSTS_TIME,'%Y-%c-%d %H:%i:%s') AS postTime , COUNT(*) as postImageNum FROM POSTS p,POSTS_IMG pimg WHERE p.USERS_NO=? and p.POSTS_NO = pimg.POSTS_NO AND p.POSTS_DEL='N' GROUP BY p.POSTS_NO ORDER BY postNo DESC";
	var tagsSQL = 'SELECT t.TAGS_NM as tagNm FROM POSTS_TAGS pt, TAGS t  WHERE pt.TAGS_NO = t.TAGS_NO AND pt.POSTS_NO=?';
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(mypostsSQL, datas[0], function (mPostsErr, mPostsRows) {
				var pageDatas = presetting.pageSetting(datas[1], 10, mPostsRows);
				if(pageDatas.length == 0){
					conn.release();
					callbackDatas.message = "page over";
					callbackDatas.success = 2;
					callbackDatas.results = [];
					callback(callbackDatas);
				} else {
					async.each(pageDatas, function (datas, callback) {
						var tags = [];
						conn.query(tagsSQL, datas.postNo, function (tagErr, tagRows ) {
							for(var i = 0; tagRows.length>i; i++){
								tags.push(tagRows[i].tagNm);
							}
							datas.postTags = tags;
							callback();
						});
					}, function (err) {
						callbackDatas.sucess = 1;
						callbackDatas.results = pageDatas;
						callbackDatas.message = 'my posts success';
						conn.release();
						callback(callbackDatas);
					});
				}
			});
		}
	});
}

exports.myLikes = function (datas, callback) {
	var callbackDatas = {};
	var myLikeSQL = "SELECT userNo, (SELECT COUNT(*) FROM LIKES AS l, POSTS AS p WHERE p.POSTS_NO=l.POSTS_NO AND p.POSTS_NO=likePosts.postNo ) AS postLikes, (SELECT COUNT(*) FROM COMMENTS c, POSTS p WHERE p.POSTS_NO=c.POSTS_NO AND p.POSTS_NO=likePosts.postNo ) AS postComments, (SELECT COUNT(*) FROM POSTS p, POSTS_IMG pimg WHERE p.POSTS_NO=pimg.POSTS_NO AND p.POSTS_NO=likePosts.postNo ) AS postImageNum , postNo, postImage, postTime, DATE_FORMAT((SELECT l.LIKES_TIME FROM LIKES l WHERE l.USERS_NO=? AND l.POSTS_NO= likePosts.postNo ), '%Y-%c-%d %H:%i:%s') AS likeTime FROM (SELECT p.USERS_NO AS userNo, u.USERS_NICK AS userNick, u.USERS_IMG_PATH AS userImage, p.POSTS_NO AS postNo, p.POSTS_THUMBNAIL AS postImage, DATE_FORMAT(p.POSTS_TIME,'%Y-%c-%d %H:%i:%s') AS postTime FROM POSTS p, LIKES l,USERS AS u WHERE p.POSTS_NO = l.POSTS_NO AND l.USERS_NO=? AND u.USERS_NO=p.USERS_NO AND p.POSTS_DEL='N') AS likePosts ORDER BY likeTime DESC";
	var tagsSQL = 'SELECT t.TAGS_NM as tagNm FROM POSTS_TAGS pt, TAGS t WHERE pt.TAGS_NO = t.TAGS_NO AND pt.POSTS_NO=?';

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(myLikeSQL, [datas[0], datas[0]], function (mLikesErr, mLikesRows) {
				var pageDatas = presetting.pageSetting(datas[1], 10, mLikesRows);
				if(mLikesErr) {
					console.error('mLikesErr = ',mLikesErr);
					conn.release();
					callback(callbackDatas);
				} else if (pageDatas.length == 0){
					conn.release();
					callbackDatas.message = "page over";
					callbackDatas.success = 2;
					callbackDatas.results = [];
					callback(callbackDatas);
				} else {
					async.each(pageDatas, function (datas, callback) {
						var tags = [];
						conn.query(tagsSQL, datas.postNo, function (tagErr, tagRows ) {
							for(var i = 0; tagRows.length>i; i++){
								tags.push(tagRows[i].tagNm);
							}
							datas.postTags = tags;
							callback();
						});
					}, function (err) {
						callbackDatas.sucess = 1;
						callbackDatas.results = pageDatas;
						callbackDatas.message = 'my likes success';
						conn.release();
						callback(callbackDatas);
					});
				}
			});
		}
	});
}

exports.myInfoGet = function (userNo, callback) {
	var callbackDatas = {};
	var miSQL = "SELECT USERS_NO AS userNo, USERS_EMAIL AS userEmail, USERS_NM AS userNm, USERS_IMG_PATH AS userImage, USERS_GENDER AS userGender, DATE_FORMAT(USERS_BIRTH,'%Y-%c-%d') AS userBirth , USERS_PHONE AS userPhone, USERS_NICK AS userNick, USERS_ADD AS userAdd, USERS_INFO AS userInfo FROM USERS WHERE USERS_NO=?";

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(miSQL, userNo, function (miErr, miRow) {
				if(miErr) {
					console.error('miErr = ', miErr );
					conn.release();
					callbackDatas.message = "my info get fail";
					callbackDatas.success = 3;
					callbackDatas.results = { "userNo" : 0, "userEmail" : " ", "userNm" : " ", "userImage" : " ", "userGender" : "N", "userBirth" : "0000-00-00", "userPhone" : "000-0000-0000", "userNick" : " ", "userAdd" : " ", "userInfo" : " "};
					callback(callbackDatas);
				} else {
					conn.release();
					callbackDatas.success = 1;
					callbackDatas.message = "my info get success";
					callbackDatas.results = miRow[0];
					callback(callbackDatas);
				}
			});
		}
	});
}

//var datas = [ userGender, userBirth, userPhone, userNick, userAdd, userInfo, 이미지, userNo ];
exports.myInfoPost = function (datas,imageUrl, callback) {
	var image = datas[6];
	var callbackDatas = {};
	callbackDatas.message = "my info get fail";
	callbackDatas.success = 3;
	callbackDatas.results = { "userNo" : 0, "userEmail" : " ", "userNm" : " ", "userImage" : " ", "userGender" : "N", "userBirth" : "0000-00-00", "userPhone" : "000-0000-0000", "userNick" : " ", "userAdd" : " ", "userInfo" : " "};
	var piSQL = 'SELECT USERS_IMG_PATH FROM USERS WHERE USERS_NO=?';
	var uiSQL = 'UPDATE USERS SET USERS_GENDER=?, USERS_BIRTH=?, USERS_PHONE=?, USERS_NICK=?, USERS_ADD=?, USERS_INFO=?, USERS_IMG_PATH=? WHERE USERS_NO = ?';
	var ui2SQL = 'UPDATE USERS SET USERS_GENDER=?, USERS_BIRTH=?, USERS_PHONE=?, USERS_NICK=?, USERS_ADD=?, USERS_INFO=?, USERS_IMG_PATH=? WHERE USERS_NO = ?';

	var miSQL = 'SELECT USERS_NO AS userNo, USERS_EMAIL AS userEmail, USERS_NM AS userNm, USERS_IMG_PATH AS userImage, USERS_GENDER AS userGender, USERS_BIRTH AS userBirth, USERS_PHONE AS userPhone, USERS_NICK AS userNick, USERS_ADD AS userAdd, USERS_INFO AS userInfo FROM USERS WHERE USERS_NO=?';
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			if(imageUrl != 0){
				var userNo = datas.pop();
				datas.pop();
				datas.push(imageUrl);
				datas.push(userNo);
				conn.query(ui2SQL, datas, function (ui2Err, uiRow) {
					if(ui2Err) {
						console.error('ui2Err = ', ui2Err);
						conn.release();
						callback(callbackDatas);
					} else {
							conn.query(miSQL, datas[7], function (miErr, miRow) {
								if(miErr) {
									console.error('miErr = ', miErr);
									conn.release();
									callabck(callbackDatas);
								} else {
									callbackDatas.success = 1;
									callbackDatas.message = "my info update success";
									callbackDatas.results = miRow[0];
									conn.release();
									callback(callbackDatas);
								}
							});
						}
				});
			} else {
				fs.copy(image.path, 'public/profileImages/' + image.filename, function (err) {
					if(err) {
						console.error('fs.copy error = ', err );
						conn.release();
						callback(callbackDatas);
					} else {
						datas[6] = presetting.address() + 'profileImages/'+image.filename; //db 저장할 경로
						conn.query(piSQL, datas[7], function (piErr, piRow) {
							if(piErr) {
								console.error(piErr);
								conn.release();
								callback(callbackDatas);
							} else {
								fs.remove(image.path, function (err) {	//복사되기 전 파일 삭제
									if(err) {
										console.error('err = ', err);
										conn.release();
										callback(callbackDatas);
									} else {
										image = piRow[0].USERS_IMG_PATH;
										if( image != presetting.defaultIMG() ) {  //기본 이미지가 아닐 경우 해당 이미지 삭제
											fs.remove('public/' + image.substring(presetting.address().length), function (err) {
												if(err) {
													console.error('err = ', err);
													conn.release();
													callback(callbackDatas);
												} else {
													conn.query(uiSQL, datas, function (uiErr, uiRow) {
														if(uiErr) {
															console.error('uiErr = ', uiErr);
															conn.release();
															callback(callbackDatas);
														} else {

																conn.query(miSQL, datas[7], function (miErr, miRow) {
																	if(miErr) {
																		console.error('miErr = ', miErr);
																		conn.release();
																		callabck(callbackDatas);
																	} else {
																		callbackDatas.success = 1;
																		callbackDatas.message = "my info update success";
																		callbackDatas.results = miRow[0];
																		conn.release();
																		callback(callbackDatas);
																	}
																});

														}
													});
												}
											});
										} else {	//기본 이미지일 경우 삭제하지 않고 변경
											conn.query(uiSQL, datas, function (uiErr, uiRow) {
												if(uiErr) {
													console.error('uiErr = ', uiErr);
													conn.release();
													callback(callbackDatas);
												} else {
													if(uiRow.affectedRows == 1) {
														conn.query(miSQL, datas[7], function (miErr, miRow) {
															if(miErr) {
																console.error('miErr = ', miErr);
																conn.release();
																callabck(callbackDatas);
															} else {
																callbackDatas.success = 1;
																callbackDatas.message = "my info update success";
																callbackDatas.results = miRow[0];
																conn.release();
																callback(callbackDatas);
															}
														});
													}
												}
											});
										}
									}
								})
							}
						});
					}
				})
			}
		}
	});
}

exports.myLog = function (userNo, page, callback) {
	var callbackDatas = {};
	var arrayData = [];
	var likeMSQL = "SELECT 'M' AS act, 'like' AS logInfo, DATE_FORMAT(l.LIKES_TIME, '%Y-%c-%d %H:%i:%s') AS logTime, l.POSTS_NO AS postNo, p.POSTS_REP_IMG AS postImage, DATE_FORMAT(l.LIKES_TIME, '%Y%j%H%i') AS sort FROM LIKES l, POSTS p WHERE l.USERS_NO=? AND l.POSTS_NO=p.POSTS_NO";
	var likeOSQL = "SELECT  'like' AS logInfo, u.USERS_NM AS act , DATE_FORMAT(l.LIKES_TIME, '%Y-%c-%d %H:%i:%s') AS logTime, l.POSTS_NO AS postNo, p.POSTS_REP_IMG AS postImage, DATE_FORMAT(l.LIKES_TIME, '%Y%j%H%i') AS sort FROM LIKES l, POSTS p, USERS u WHERE l.POSTS_NO=p.POSTS_NO AND p.USERS_NO=? AND l.USERS_NO=u.USERS_NO;";
	var commentsMSQL = "SELECT 'M' AS act , c.COMMENTS_CONTENTS AS logInfo , DATE_FORMAT(c.COMMENTS_TIME , '%Y-%c-%d %H:%i:%s') AS logTime, c.POSTS_NO AS postNo, p.POSTS_REP_IMG AS postImage, DATE_FORMAT(c.COMMENTS_TIME, '%Y%j%H%i') AS sort FROM COMMENTS c, POSTS p WHERE c.POSTS_NO=p.POSTS_NO AND c.USERS_NO=?;";
	var commentsOSQL = "SELECT u.USERS_NM AS act , c.COMMENTS_CONTENTS AS logInfo ,  DATE_FORMAT(c.COMMENTS_TIME , '%Y-%c-%d %H:%i:%s') AS logTime, c.POSTS_NO AS postNo, p.POSTS_REP_IMG AS postImage, DATE_FORMAT(c.COMMENTS_TIME, '%Y%j%H%i') AS sort FROM COMMENTS c, POSTS p, USERS u WHERE c.POSTS_NO=p.POSTS_NO AND p.USERS_NO=? AND c.USERS_NO=u.USERS_NO;";
	var postSQL = "SELECT 'post' AS logInfo, 'M' AS act, DATE_FORMAT(POSTS.POSTS_TIME, '%Y-%c-%d %H:%i:%s') AS logTime, POSTS.POSTS_REP_IMG AS postImage, POSTS.POSTS_NO AS postNo, DATE_FORMAT(POSTS.POSTS_TIME , '%Y%j%H%i') AS sort FROM POSTS WHERE POSTS.USERS_NO=?";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(likeMSQL, userNo, function (lmErr, lmROWS) {
				if (lmErr) {
					console.error('lmErr = ', lmErr);
					callbackDatas.message = "my log list fail";
					callbackDatas.success = 3;
					callbackDatas.results = [];
					conn.release();
					callback(callbackDatas);
				} else {
					conn.query(likeOSQL, userNo, function (loErr, loROWS) {
						if(loErr) {
							console.error('loErr = ', loErr);
							callbackDatas.message = "my log list fail";
							callbackDatas.success = 3;
							callbackDatas.results = [];
							conn.release();
							callback(callbackDatas);
						} else {
							conn.query(commentsMSQL, userNo, function (cmErr, cmROWS) {
								if(cmErr) {
									console.error('cmErr = ', cmErr);
									callbackDatas.message = "my log list fail";
									callbackDatas.success = 3;
									callbackDatas.results = [];
									conn.release();
									callback(callbackDatas);
								} else {
									conn.query(commentsOSQL, userNo, function (coErr, coROWS) {
										if(coErr) {
											console.error('coErr = ', coErr);
											callbackDatas.message = "my log list fail";
											callbackDatas.success = 3;
											callbackDatas.results = [];
											conn.release();
											callback(callbackDatas);
										} else {
											conn.query(postSQL, userNo, function (pErr, pRows){
												if(pErr) {
													console.error('pErr = ', pErr);
													callbackDatas.message = "my log list fail";
													callbackDatas.success = 3;
													callbackDatas.results = [];
													conn.release();
													callback(callbackDatas);
												} else {
													//배열 합치기
													arrayData = lmROWS.concat(loROWS);
													arrayData = arrayData.concat(cmROWS);
													arrayData = arrayData.concat(coROWS);
													arrayData = arrayData.concat(pRows);
													//배열을 시간순으로 sort
													arrayData.sort( function (a, b) {
														return b.sort - a.sort;
													});
													callbackDatas.success = 1;
													callbackDatas.results = presetting.pageSetting(page, 10, arrayData);
													if(callbackDatas.results.length == 0){
														callbackDatas.message = "page over";
													} else {
														callbackDatas.message = "my log list success";
													}
													conn.release();
													callback(callbackDatas);
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

