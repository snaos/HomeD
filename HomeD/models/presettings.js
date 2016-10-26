
var request = require('request');
var fs = require('fs-extra');

//db 접속 세팅
exports.mysql_pool = function(mysql) {

	var pool = mysql.createPool({
	    connectionLimit: 150,
	    host: 'homed.co.kr',
	    user: 'root',
	    password: 'homed0314',
	    database: 'mydb'
	});

	return pool;

}

//uri에서 이미지를 다운로드 하기
exports.download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

// 게시글 페이지 세팅
exports.pageSetting = function(page, pageSize, dataArray){
	if(!dataArray){
		var totalCnt = 0;
	} else{
		var totalCnt = dataArray.length;
	}
	var totalPage = Math.ceil(totalCnt / pageSize);
	var startNo = (page-1) * pageSize;
	var endNo = (page * pageSize) - 1;
	var returnData  = [];
	//첫 페이지일 경우
	if(page == 1 && totalPage > 0) {
		var pageData = [];
		for(var i = 0; (i < pageSize) && (i < totalCnt); i++){
			returnData[i] = dataArray[i];
		}
	} else if (page > totalPage || totalPage == 0) {	//페이지가 없음 == 데이터가 없음

	} else {
		if(endNo > totalCnt) {
			endNo = totalCnt - 1;
		}
		for (var i = 0; i <(endNo-startNo+1); i++){
			returnData[i] = dataArray[i+startNo];
		}
	}
	return returnData;
}


exports.lastInsertID = function(){
	return 'SELECT LAST_INSERT_ID() AS li';
}

exports.address = function(){
	return 'http://www.homed.co.kr/';
}

exports.defaultIMG = function(){
	return 'http://www.homed.co.kr/profile.jpg';
}

exports.dirPath = function () {
	return '/home/ubuntu/Home.d/';
}