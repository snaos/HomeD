var mysql = require('mysql');
var async = require('async');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.productUpload = function (datas, images, callback) {
	var callbackDatas = {};
	callbackDatas.results = {};
	callbackDatas.success = 3;
	callbackDatas.message = "product upload fail"

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas );
		} else {

		}
	});
}