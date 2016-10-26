// var mysql = require('mysql');
var async = require('async');
var fs = require('fs-extra');
// var presetting = require('../presettings');
// var pool =  presetting.mysql_pool(mysql);

exports.driver = function (callback) {
	fs.readdir(process.cwd(), function (err, files) {
	  if (err) {
	    console.log(err);
	    callback(err);
	  }
	  console.log(files);
	  callback(files);
	});
}