var mysql = require('mysql');
var async = require('async');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.interiorStart = function (callback) {
	var callbackDatas = {};
	callbackDatas.message = "interior fail";
	callbackDatas.success = 3;
	callbackDatas.design = [];
	callbackDatas.construction = [];

	var interiorStartDesignSQL = "SELECT ICON_NO AS interiorImgNo, ICON_PATH AS interiorImgPath, ICON_INFO AS interiorImgInfo, ICON_NM AS interiorImgNm FROM ICON_IMG AS ii WHERE ii.ICON_INFO='design'";
	var interiorStartConstructionSQL = "SELECT ICON_NO AS interiorImgNo, ICON_PATH AS interiorImgPath, ICON_INFO AS interiorImgInfo, ICON_NM AS interiorImgNm FROM ICON_IMG AS ii WHERE ii.ICON_INFO='construction'";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(interiorStartDesignSQL, function (issErr, issRows) {
				if(issErr) {
					console.error('issErr = ', issErr);
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.design = issRows;
					conn.query(interiorStartConstructionSQL, function (isscErr, isscRows) {
						callbackDatas.construction = isscRows;
						conn.release();
						callbackDatas.success = 1;
						callbackDatas.message = "interior success";
						callback(callbackDatas);
					});
				}
			});
		}
	});
}

exports.interiorRoomImg = function (callback) {
	var callbackDatas = {};
	callbackDatas.results = [];
	callbackDatas.success = 3;
	callbackDatas.message = "interior room fail"

	var roomImgSQL = "SELECT ICON_NO AS no, ICON_PATH AS imgPath, ICON_NM AS roomNm FROM ICON_IMG AS ii WHERE ii.ICON_INFO='room'";

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(roomImgSQL, function (riErr, riRows) {
				if(riErr) {
					console.error('riErr = ', riErr );
					conn.release();
					callback(callbackDatas );
				} else {
					callbackDatas.success = 1;
					callbackDatas.message = "interior room success";
					callbackDatas.results = riRows;
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}

exports.selectImages = function ( page, callback) {
	var callbackDatas = {};
	callbackDatas.results = [];
	callbackDatas.success = 3;
	callbackDatas.message = "interior select image fail";

	var selectImagesSQL = "SELECT INTERIOR_IMG_PATH AS interiorImgPath FROM INTERIOR_IMG2 AS ii WHERE ii.INTERIOR_IMG_NM='select'";

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(selectImagesSQL, function (siErr, siRows) {
				if(siErr) {
					console.error('siErr = ', siErr );
					conn.release();
					callback(callbackDatas );
				} else {
					var pageDatas = presetting.pageSetting(page, 30, siRows);
					if(pageDatas.length == 0) {
						callbackDatas.message = "page over";
						callbackDatas.success = 2;
						callbackDatas.results = [];
						conn.release();
						callback(callbackDatas);
					} else {
						callbackDatas.message = "interior select image success";
						callbackDatas.success = 1;
						for(var i = 0; i< pageDatas.length; i++) {
							pageDatas[i] = pageDatas[i].interiorImgPath;
						}
						callbackDatas.results = pageDatas;
						conn.release();
						callback(callbackDatas);
					}
				}
			});
		}
	});
}

// var datas = [interiorType, interiorInfo, interiorUserInfo, interiorImages];
exports.interiorEnd = function (datas, userNo, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "interior fail"

	var interiorInserSQL ="INSERT INTO INTERIOR(INTERIOR_TYPE, INTERIOR_INFO, INTERIOR_USER_INFO, INTERIOR_IMAGES,USERS_NO, INTERIOR_FLOW_STATUS, INTERIOR_TIME, INTERIOR_ID) VALUES(?,?,?,?,?,?,NOW(),?)";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			datas.push(userNo);
			datas.push("상담 요청");
			datas.push(Date.now());
			conn.query(interiorInserSQL, datas, function (iiErr, iiRows) {
				if(iiErr) {
					console.error('iiErr = ', iiErr );
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.success = 1;
					callbackDatas.message = "interior success";
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}

exports.wishList = function (userNo, page, callback) {
	var callbackDatas = {};
	callbackDatas.results = [];
	callbackDatas.success = 3;
	callbackDatas.message = "wish list fail"
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			var wishSQL = "SELECT INTERIOR_NO AS interiorNo, INTERIOR_TYPE AS interiorType, INTERIOR_FLOW_STATUS AS interiorFlowStatus, DATE_FORMAT(INTERIOR_TIME,'%Y-%c-%d %H:%i:%s') AS interiorTime FROM INTERIOR WHERE USERS_NO=?";
			conn.query(wishSQL, userNo, function (wErr, wRows ) {
				if(wErr) {
					console.error('wErr = ', wErr );
					conn.release();
					callback(callbackDatas);
				} else {
					var pageDatas = presetting.pageSetting(page, 10, wRows);
					if(pageDatas.length == 0) {
						callbackDatas.message = "page over";
						callbackDatas.success = 2;
						callbackDatas.results = [];
						conn.release();
						callback(callbackDatas);
					} else {
						callbackDatas.success = 1;
						callbackDatas.message = "wish list success";
						callbackDatas.results = pageDatas;
						conn.release();
						callback(callbackDatas);
					}
				}
			});
		}
	});
}


////-------------------------------------------------


exports.interiorList = function (userNo, page, callback) {
	var callbackDatas = {};
	callbackDatas.results = [];
	callbackDatas.success = 3;
	callbackDatas.message = "interior list fail"

	var interiorListSQL = "SELECT postNo,userNo, postImage, postTime, userNick, userImage, postBuy, postDel , (SELECT 1 FROM LIKES l WHERE EXISTS( SELECT LIKES_NO FROM LIKES WHERE l.USERS_NO=? AND interiorList.postNo = l.POSTS_NO)) AS likeStatus, (SELECT COUNT(*) FROM POSTS_IMG AS pimg WHERE pimg.POSTS_NO = interiorList.postNo ) AS postImageNum FROM (SELECT p.POSTS_NO AS postNo, DATE_FORMAT(p.POSTS_TIME,'%Y-%c-%d %H:%i:%s') AS postTime, p.POSTS_DEL AS postDel, p.POSTS_REP_IMG AS postImage, u.USERS_NICK AS userNick, u.USERS_IMG_PATH AS userImage, p.POSTS_BUY as postBuy, u.USERS_NO AS userNo FROM POSTS AS p, USERS AS u WHERE p.USERS_NO=u.USERS_NO AND p.POSTS_DEL='N' ORDER BY postTime DESC) interiorList";
	var tagsSQL = 'SELECT t.TAGS_NM as tagNm FROM POSTS_TAGS pt, TAGS t  WHERE pt.TAGS_NO = t.TAGS_NO AND pt.POSTS_NO=?';

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(interiorListSQL, userNo, function (ilErr, ilRows) {
				if(ilErr) {
					console.error('ilErr = ', ilErr);
					conn.release();
					callback(callbackDatas);
				} else {
					var pageDatas = presetting.pageSetting(page, 10, ilRows);
					if(pageDatas.length == 0) {
						callbackDatas.message = "page over";
						callbackDatas.success = 2;
						callbackDatas.results = [];
						conn.release();
						callback(callbackDatas);
					} else {
						async.each(pageDatas, function (datas, callback) {
							var tags = [];
							conn.query(tagsSQL, datas.postNo, function (tagErr, tagRows ) {
								for(var i = 0; tagRows.length>i; i++){
									tags.push(tagRows[i].tagNm);
								}
								if(datas.likeStatus == null) {
									datas.likeStatus = 0;
								}
								datas.postTags = tags;
								callback();
							});
						}, function (err) {
							callbackDatas.sucess = 1;
							callbackDatas.results = pageDatas;
							callbackDatas.message = 'interior list success';
							conn.release();
							callback(callbackDatas);
						});
					}
				}
			});
		}
	});
}

exports.wishListDetail = function (userNo, interiorNo, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "wish list detail fail";
	callbackDatas.results = {};
	var interiorSelectSQL = "SELECT INTERIOR_TYPE AS interiorType, INTERIOR_INFO AS interiorInfo, INTERIOR_USER_INFO AS interiorUserInfo, INTERIOR_FLOW_STATUS AS interiorFlowStatus, DATE_FORMAT(INTERIOR_TIME,'%Y-%c-%d %H:%i:%s') AS interiorTime, INTERIOR_IMAGES AS interiorImages FROM INTERIOR WHERE INTERIOR_NO=? AND USERS_NO=?";
	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(interiorSelectSQL,[interiorNo, userNo], function (isErr, isRows) {
				if(isErr) {
					console.error('isErr = ', isErr);
					conn.release();
					callback(callbackDatas);
				} else {
					//방 종류/ㅇ예산안/ 주거형태
					var interiorInfo = isRows[0].interiorInfo.split('/');
					//이름 지역 핸드폰
					var interiorUserInfo = isRows[0].interiorUserInfo.split('/');
					callbackDatas.results = {
						"interiorType" : isRows[0].interiorType,
						"interiorFlowStatus" : isRows[0].interiorFlowStatus,
						"interiorTime" : isRows[0].interiorTime,
						"room" : interiorInfo[0],
						"bill" : interiorInfo[1],
						"dwellingPattern" : interiorInfo[2],
						"userName" : interiorUserInfo[0],
						"userArea" : interiorUserInfo[1],
						"userPhone" : interiorUserInfo[2]
					}
					callbackDatas.success = 1;
					callbackDatas.message = "wish list detail success";
					conn.release();
					callback(callbackDatas);

				}
			});
		}
	});
}

exports.category = function(callback) {
	var callbackDatas = {};
	callbackDatas.results = [];
	callbackDatas.success = 3;
	callbackDatas.message = "category list fail";
	var categoryNmSelectSQL = "SELECT DISTINCT c.CATEGORY_NM AS categoryNm FROM CATEGORY AS c";
	var categoryInfoSQL = "SELECT c.CATEGORY_INFO AS infoList FROM CATEGORY AS c WHERE c.CATEGORY_NM=?";
	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(categoryNmSelectSQL, function (cnsErr, cnsRows){
				if(cnsErr) {
					console.error('cnsErr = ', cnsErr);
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.results = cnsRows;
					async.each(cnsRows, function (row, callback) {
						conn.query(categoryInfoSQL, row.categoryNm, function (ciErr, ciRows) {
							if(ciErr) {
								console.error('ciErr = ', ciErr);
								callback(ciErr);
							} else {
								row.infoList = [];
								for(var i = 0; i < ciRows.length; i++) {
									row.infoList.push(ciRows[i].infoList);
								}
								callback();
							}
						});
					}, function (err) {
						if(err){
							console.error ('err = ', err);
						}
						callbackDatas.success = 1;
						callbackDatas.message = "cateogry list success";
						callbackDatas.results = cnsRows;
						conn.release();
						callback(callbackDatas);
					});
				}
			});
		}
	});
}

exports.categoryResults = function (category, callback) {
	var callbackDatas = {};
	callbackDatas.results = [];
	callbackDatas.success = 3;
	callbackDatas.message = "category list fail";

	var categoryList = category[0]+'_'+category[1]+'_'+category[2];

	var categorySelectSQL = "SELECT p.POSTS_NO AS postNo, p.POSTS_REP_IMG AS postImage FROM POSTS AS p WHERE p.POSTS_INFO=?"
	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {
			conn.query(categorySelectSQL, categoryList, function (csErr, csRows) {
				if(csErr) {
					console.error('csErr = ', csErr);
					conn.release();
					callback(callbackDatas);
				} else {
					conn.release();
					callbackDatas.results = csRows;
					callbackDatas.success = 1;
					callbackDatas.message = "category results success";
					callback(callbackDatas);
				}
			});
		}
	});
}