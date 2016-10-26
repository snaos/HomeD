var mysql = require('mysql');
var async = require('async');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.questionList = function (page, callback) {
	var callbackDatas = {};
	callbackDatas.success = 0;
	var plSQL = "SELECT QUESTION_NO AS questionNo, DATE_FORMAT(QUESTION_TIME, '%Y-%c-%d %H:%i:%s') AS questionTime, QUESTION_HIT AS questionHit, QUESTION_SECRET AS questionSecret, QUESTION_TITLE AS questionTitle, QUESTION_USER AS questionUser FROM HOMEPAGE_QUESTION WHERE QUESTION_REPLY=0 AND QUESTION_DEL = 0 ORDER BY QUESTION_NO DESC";
	var frSQL = "SELECT QUESTION_NO AS questionNo, DATE_FORMAT(QUESTION_TIME, '%Y-%c-%d %H:%i:%s') AS questionTime, QUESTION_HIT AS questionHit, QUESTION_SECRET AS questionSecret, QUESTION_TITLE AS questionTitle, QUESTION_USER AS questionUser FROM HOMEPAGE_QUESTION WHERE QUESTION_REPLY=? AND QUESTION_DEL = 0 ORDER BY QUESTION_NO ASC";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
	 	} else {
	 		conn.query(plSQL, function (plErr, plRows) {
	 			var pageSize = 10;
	 			var totalPage = Math.ceil(plRows.length/pageSize);
	 			var startPage = Math.floor((page-1)/pageSize) * pageSize+1
	 			var endPage = startPage+(pageSize - 1);
	 			if(endPage > totalPage) {
	 				endPage = totalPage;
	 			}
	 			var max = plRows.length-((page-1)*pageSize);
	 			var pageDatas = presetting.pageSetting(page, pageSize, plRows);
	 			if(pageDatas.length) {
	 				async.each(pageDatas, function (data, callback) {
	 					conn.query(frSQL, data.questionNo, function (frErr, frRows) {
	 						data.reNo = frRows.length;
	 						data.re = frRows;
	 						callback();
	 					});
	 				}, function(err) {
	 					callbackDatas.success = 1;
	 					callbackDatas.pageDatas = pageDatas;
	 					callbackDatas.totalPage = totalPage;
	 					callbackDatas.startPage = startPage;
	 					callbackDatas.endPage = endPage;

	 					callbackDatas.page = page;
	 					conn.release();
	 					callback(callbackDatas);
	 				})
	 			} else {//page over
	 				callbackDatas.success = 2;
	 				conn.release();
	 				callback(callbackDatas);
	 			}
	 		});
	 	}
	});
}

exports.questionRead = function (questionNo, password, callback){
	var callbackDatas = {};
	callbackDatas.success = 0;
	var qruSQL = "UPDATE HOMEPAGE_QUESTION SET QUESTION_HIT =  QUESTION_HIT+1 WHERE  QUESTION_NO=?";
	var qrSQL = "SELECT QUESTION_NO AS questionNo, DATE_FORMAT(QUESTION_TIME, '%Y-%c-%d %H:%i:%s') AS questionTime, QUESTION_HIT AS questionHit, QUESTION_SECRET AS questionSecret, QUESTION_TITLE AS questionTitle, QUESTION_USER AS questionUser, QUESTION_CONTENT AS questionContent FROM HOMEPAGE_QUESTION WHERE QUESTION_NO=? AND QUESTION_PWD=?"
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
 			console.error('connErr = ', connErr );
 			callback(callbackDatas);
 		} else {
 			conn.query(qrSQL, [questionNo, password], function (qrErr, qrRows) {
 				if(qrErr) {
 					console.error('qrErr = ', qrErr);
 					conn.release();
 					callback(callbackDatas);
 				} else if(qrRows.length == 0) {
 					callbackDatas.success = -1;
 					conn.release();
 					callback(callbackDatas);
 				} else {
 					conn.query(qruSQL, questionNo, function (qruErr, qruRwos) {
 						if(qrErr) {
 							console.error('qrErr = ', qrErr);
 						}
 						callbackDatas.results = qrRows[0];
 						callbackDatas.success = 1;
 						conn.release();
 						callback(callbackDatas);
 					})
 				}
 			});
 		}
	});
}