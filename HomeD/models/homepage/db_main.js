var mysql = require('mysql');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.designerList = function (callback) {
	var callbackDatas = {};
	callbackDatas.success = 0;
	var dlSQL = "SELECT DESIGNER_NO AS desingerNo, DESIGNER_NM AS designerNm,DESIGNER_IMG AS designerImg, DESIGNER_INFO AS designerInfo FROM DESIGNER";
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
	 	} else {
	 		conn.query(dlSQL, function (dlErr, dlRows) {
	 			if(dlErr) {
	 				console.error('dlErr = ', dlErr);
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				callbackDatas.success = 1;
	 				callbackDatas.results = dlRows;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	})
}

exports.homed_story = function (callback) {
	var callbackDatas = {}
	var homedStorySQL = "SELECT HOMED_STORY_NO AS homedStoryNo, HOMED_STORY_NM AS homedStoryNm, HOMED_STORY_INFO AS homedStoryInfo, HOMED_STORY_MAIN AS homedStoryMain, HOMED_STORY_DESIGNER AS homedDesigner, HOMED_STORY_SLIDE_IMG AS slideImg FROM HOMED_STORY";

	callbackDatas.success = 0;
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
	 	} else {
	 		conn.query(homedStorySQL,function (hsErr, hsRows) {
	 			if(hsErr) {
	 				console.error('hsErr = ', hsErr );
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				callbackDatas.success = 1;
	 				callbackDatas.results = hsRows;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	});
}

exports.homed_storyList = function (homedStoryNo, callback) {
	var callbackDatas = {}
	var homedStoryListSQL = "SELECT HOMED_STORY_IMG_NO AS homedStoryImgNo, HOMED_STORY_IMG_PATH AS homedStoryImgPath, HOMED_STORY_IMG_INFO AS homedStoryImgInfo FROM HOMED_STORY_IMG WHERE HOMED_STORY_NO =?";
	callbackDatas.success = 0;
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
	 	} else {
	 		conn.query(homedStoryListSQL, homedStoryNo, function ( hslErr, hslRows ) {
	 			if(hslErr){
	 				console.error('hslErr = ', hslErr );
	 				conn.release();
	 				callback(callbackDatas);
	 			} else if(hslRows.length ==0 ) {
	 				conn.query(homedStoryListSQL, 2, function ( hslErr, hslRows ) {
	 					if(hslErr){
	 						console.error('hslErr = ', hslErr );
	 						conn.release();
	 						callback(callbackDatas);
	 					} else {
			 				callbackDatas.results = hslRows;
			 				callbackDatas.success = 1;
			 				conn.release();
			 				callback(callbackDatas);
			 			}
	 				});
	 			} else {
	 				callbackDatas.results = hslRows;
	 				callbackDatas.success = 1;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	});
}

exports.requestInterior =function( datas,callback) {
	var requestSQL = "INSERT INTO INTERIOR(INTERIOR_TIME,USERS_NO,INTERIOR_FLOW_STATUS,INTERIOR_IMAGES, INTERIOR_ROOM_IMG, INTERIOR_USER_NM, INTERIOR_USER_BILL, INTERIOR_USER_HOUSING, INTERIOR_USER_ADDRESS, INTERIOR_USER_PHONE, INTERIOR_USER_EMAIL, INTERIOR_USER_MESSAGE, INTERIOR_OFFLINE,INTERIOR_CONCEPT,INTERIOR_TYPE,INTERIOR_AGE,INTERIOR_FUNNEL,INTERIOR_ID) VALUES(NOW(),0,'전화 상담 필요',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	var callbackDatas = {};
	callbackDatas.success = 0;
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
	 	} else {
	 		datasKeys = Object.keys(datas);
	 		var inputDatas = [];
	 		for(var i=0;i<datasKeys.length; i++) {
	 			inputDatas.push(datas[datasKeys[i]]);
	 		}
	 		inputDatas.push(Date.now());
	 		conn.query(requestSQL, inputDatas, function (rErr, rRows) {
	 			if(rErr) {
	 				console.error('rErr = ', rErr);
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				conn.query(presetting.lastInsertID(), function (liErr, liRows) {
	 					if(liErr) {
	 						console.error('liErr = ', liErr);
	 						callback(callbackDatas);
	 						conn.release();
	 					} else {
	 						callbackDatas.success = 1;
	 						callbackDatas.no = liRows[0].li;
	 						callback(callbackDatas);
		 					conn.release();
	 					}
	 				});
	 			}
	 		})
	 	}
	});
};

exports.homed_story_2  = function ( callback ) {
		var callbackDatas = {}
		var homedStoryListSQL = "SELECT HOMED_STORY_2_NO AS homedStoryNo, HOMED_STORY_2_TITLE AS homedStoryTitle, HOMED_STORY_2_SERVICE AS homedStoryService, HOMED_STORY_2_PERIOD AS homedStoryPeriod, HOMED_STORY_2_BILL AS homedStoryBill, HOMED_STORY_2_REP_IMG AS homedStoryRepImg FROM HOMED_STORY_2";
		callbackDatas.success = 0;
		pool.getConnection(function (connErr, conn) {
			if(connErr) {
	 			console.error('connErr = ', connErr );
	 			callback(callbackDatas);
		 	} else {
		 		conn.query(homedStoryListSQL, function ( hslErr, hslRows ) {
		 			if(hslErr){
		 				console.error('hslErr = ', hslErr );
		 				conn.release();
		 				callback(callbackDatas);
		 			} else {
		 				callbackDatas.results = hslRows;
		 				callbackDatas.success = 1;
		 				conn.release();
		 				callback(callbackDatas);
		 			}
		 		});
		 	}
		});
}
exports.homed_story_2_post  = function ( portpolioNo, callback ) {
		var callbackDatas = {}
		var homedStorySQL = "SELECT HOMED_STORY_2_NO AS homedStoryNo, HOMED_STORY_2_TITLE AS homedStoryTitle, HOMED_STORY_2_SERVICE AS homedStoryService, HOMED_STORY_2_PERIOD AS homedStoryPeriod, HOMED_STORY_2_BILL AS homedStoryBill, HOMED_STORY_2_REP_IMG AS homedStoryRepImg,HOMED_STORY_2_CONCEPTBOARD AS conceptboard, HOMED_STORY_2_HOUSING AS housing, HOMED_STORY_2_SIZE AS homeSize, HOMED_STORY_2_CONCEPT AS concept, HOMED_STORY_2_PATH AS imgPath, HOMED_STORY_2_LIST AS imgList, HOMED_STORY_2_TEXT AS portpolioText,HOMED_STORY_2_DESIGNER_TEXT AS designerText, HOMED_STORY_2_DESIGNER_IMG AS designerImg, HOMED_STORY_2_USERTEXT AS userText FROM HOMED_STORY_2 WHERE HOMED_STORY_2_NO=?";
		callbackDatas.success = 0;
		pool.getConnection(function (connErr, conn) {
			if(connErr) {
	 			console.error('connErr = ', connErr );
	 			callback(callbackDatas);
		 	} else {
		 		conn.query(homedStorySQL, portpolioNo ,function ( hsErr, hsRows ) {
		 			if(hsErr){
		 				console.error('hsErr = ', hsErr );
		 				conn.release();
		 				callback(callbackDatas);
		 			} else {
		 				var imgList = hsRows[0].imgList;
		 				callbackDatas.results = hsRows[0];
		 				callbackDatas.imgList = imgList.split(',');
		 				callbackDatas.success = 1;
		 				conn.release();
		 				callback(callbackDatas);
		 			}
		 		});
		 	}
		});
}
exports.getConceptImages = function (concept, callback) {
	var callbackDatas = {}
	var imgSQL = "SELECT CONCEPT_IMG_PATH FROM CONCEPT_IMGS WHERE CONCEPT_NM=? ";
	callbackDatas.success = 0;
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
	 	} else {
	 		conn.query(imgSQL, concept ,function ( iErr, iRows ) {
	 			if(iErr){
	 				console.error('iErr = ', iErr );
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				callbackDatas.results = iRows;
	 				callbackDatas.success = 1;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	});
}

exports.do_interior_apply_data_save = function (userObjectData, callback) {
	console.log("디비로 접속");
	var callbackDatas = {}
	var diadsSQL = "INSERT INTO INTERIOR(INTERIOR_TYPE,TERMS_AGREE,INTERIOR_MOVE,INTERIOR_INFO, INTERIOR_FLOW_STATUS, INTERIOR_TIME, INTERIOR_ID,INTERIOR_USER_HOUSING,INTERIOR_CONSTRUCTION,INTERIOR_SPACE_INFO,INTERIOR_QUIZ_INFO,INTERIOR_ROOM_IMG,INTERIOR_USER_NM,INTERIOR_AGE,INTERIOR_USER_SEX,INTERIOR_USER_JOB,INTERIOR_USER_EMAIL,INTERIOR_USER_ADDRESS,INTERIOR_USER_PHONE,INTERIOR_USER_PHONETIME,INTERIOR_USER_BILL,INTERIOR_FUNNEL,INTERIOR_USER_MESSAGE,INTERIOR_CONCEPT) VALUES(?,?,?, ?,?,NOW(), ?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?)";
	var userObjectDatasKeys = Object.keys(userObjectData);

	var insertData = [];
	//INTERIOR_TYPE
	insertData.push(userObjectData[userObjectDatasKeys[0]]);
	//TERMS_AGREE
	insertData.push(userObjectData[userObjectDatasKeys[1]]);
	//INTERIOR_MOVE
	insertData.push(userObjectData[userObjectDatasKeys[2]]);
	//INTERIOR_INFO
	insertData.push('상담 요망');
	//INTERIOR_FLOW_STATUS
	insertData.push('전화 상담 요망');
	//INTERIOR_ID
	insertData.push(Date.now());
	//INTERIOR_USER_HOUSING
	insertData.push(userObjectData[userObjectDatasKeys[3]]);
	//INTERIOR_CONSTRUCTION
	insertData.push(userObjectData[userObjectDatasKeys[4]]);
	//INTERIOR_SPACE_INFO
	var spaceInfo = '';
	spaceInfo += '거실 : '+userObjectData[userObjectDatasKeys[5]] +' / 침실 : '+userObjectData[userObjectDatasKeys[7]] +' / 화장실 : '+userObjectData[userObjectDatasKeys[6]] +' / 드레스룸 : '+userObjectData[userObjectDatasKeys[8]] +' / 아이방 : '+userObjectData[userObjectDatasKeys[9]] +' / 부엌 : '+userObjectData[userObjectDatasKeys[10]] +' / 기타 : '+userObjectData[userObjectDatasKeys[11]] +' / 잘모르겠어요 : '+userObjectData[userObjectDatasKeys[12]] +' / 총합 : '+userObjectData[userObjectDatasKeys[13]] ;

	insertData.push(spaceInfo);
	//INTERIOR_QUIZ_INFO
	var interiorQuizInfo = '';
	var conceptImg = userObjectData[userObjectDatasKeys[17]][0] + ' , ' +userObjectData[userObjectDatasKeys[17]][1] + ' , ' +userObjectData[userObjectDatasKeys[17]][2];
	interiorQuizInfo += userObjectData.conceptColor;
	interiorQuizInfo += ' / ' + userObjectData.pattern + ' / concept furniture = ' +userObjectData.furniture + ' / concept img ='+ conceptImg + ' / ' +userObjectData.concept;
	insertData.push(interiorQuizInfo);
	//INTERIOR_ROOM_IMG
	var seletImg = '';
	if( userObjectData[userObjectDatasKeys[19]].length == 0) {
		seletImg = '없음/';
	} else {
		for(var i = 1; i < userObjectData[userObjectDatasKeys[19]].length; i++) {
			seletImg += 'http://www.homed.co.kr'+userObjectData[userObjectDatasKeys[19]][i] +',';
		}
	}
	var seletImg = seletImg.substring(0,seletImg.length-1);
	insertData.push(seletImg);
	//INTERIOR_USER_NM
	insertData.push(userObjectData[userObjectDatasKeys[20]]);

	// 나이		INTERIOR_AGE
	insertData.push(userObjectData[userObjectDatasKeys[21]]);
	// 성별		INTERIOR_USER_SEX
	insertData.push(userObjectData[userObjectDatasKeys[22]]);
	// 직업		INTERIOR_USER_JOB
	insertData.push(userObjectData[userObjectDatasKeys[23]]);
	// 메일			INTERIOR_USER_EMAIL
	insertData.push(userObjectData[userObjectDatasKeys[24]]);
	// 주소			INTERIOR_USER_ADDRESS
	insertData.push(userObjectData[userObjectDatasKeys[25]]);
	// 폰 			INTERIOR_USER_PHONE
	insertData.push(userObjectData[userObjectDatasKeys[26]]);
	// 폰가능시간		INTERIOR_USER_PHONETIME
	insertData.push(userObjectData[userObjectDatasKeys[27]]);
	// 예산안 			INTERIOR_USER_BILL
	insertData.push(userObjectData[userObjectDatasKeys[28]]);
	// 유입경로			INTERIOR_FUNNEL
	insertData.push(userObjectData[userObjectDatasKeys[29]]);
	// 메시지		INTERIOR_USER_MESSAGE
	insertData.push(userObjectData[userObjectDatasKeys[30]]);
	insertData.push(userObjectData[userObjectDatasKeys[18]]);
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(insertData);
	 	} else {
	 		conn.query(diadsSQL, insertData ,function ( diadsErr, diadsRows ) {
	 			if(diadsErr){
	 				console.error('diadsErr = ', diadsErr );
	 				conn.release();
	 				callback(insertData);
	 			} else {
	 				conn.release();
	 				callback(insertData);
	 			}
	 		});
	  }
	});
}