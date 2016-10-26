var mysql = require('mysql');
var async = require('async');
var fs = require('fs-extra');
var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.addShop = function  (datas, image, callback) {
	var callbackDatas = {};
	var insertShopSQL = "INSERT INTO SHOP(SHOP_NM, SHOP_INFO, SHOP_URL, SHOP_ENM, SHOP_LOGO, SHOP_REP_IMG) VALUES(?,?,?,?,?,?)";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			//쇼핑몰 폴더 생성.
			fs.mkdirs('public/shop/'+datas[3], function (err) {
				if(err) {
					console.error(err);
					callbackDatas.message = "directory error";
					callbackDatas.success = 3;
					conn.release();
					callback(callback);
				} else {
					// 업로드한 파일 이동. 0번은 로고
					fs.move(image[0].path, 'public/shop/'+datas[3]+'/'+image[0].filename, function (err){
						if (err) {
							console.error(err);
							callbackDatas.message = "file move error";
							callbackDatas.success = 3;
							conn.release();
							callback(callback);
						} else {
							//1번은 대표이미지.
							fs.move(image[1].path, 'public/shop/'+datas[3]+'/'+image[1].filename, function (err){
								if (err) {
									console.error(err);
									callbackDatas.message = "file move error";
									callbackDatas.success = 3;
									conn.release();
									callback(callback);
								} else {
									//접근할 url
									datas.push(presetting.address()+'shop/'+datas[3]+'/'+image[0].filename);
									datas.push(presetting.address()+'shop/'+datas[3]+'/'+image[1].filename);
									conn.query(insertShopSQL, datas, function (isErr, isRows) {
										if(isErr) {
											console.error('isErr = ', isErr);
											callbackDatas.message = "insert sql error";
											callbackDatas.success = 3;
											conn.release();
											callback(callbackDatas);
										} else {
											callbackDatas.message = "success";
											callbackDatas.success = 1;
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

exports.getShopInfo = function (callback) {
	var callbackDatas = {};
	var shopSQL = "SELECT * FROM SHOP";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(shopSQL, function (sErr, sRows) {
				if(sErr) {
					callbackDatas.message = "select sql error";
					callbackDatas.success = 3;
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.message = 'success';
					callbackDatas.success = 1;
					callbackDatas.results = sRows;
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}

// var datas = [goodsNm, goodsPrice, goodsUrl, shopNo];
exports.addGoods = function (datas, image, callback) {
	var callbackDatas = {};
	var shopSQL = "INSERT INTO SHOP_GOODS(SHOP_GOODS_NM,SHOP_GOODS_PRICE, SHOP_GOODS_URL,SHOP_NO, SHOP_GOODS_IMG,SHOP_GOODS_INFO) VALUES(?,?,?,?,?,?)";
	var shopInfo = "SELECT SHOP_ENM AS shopEnm FROM SHOP WHERE SHOP_NO=?";

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(shopInfo, datas[3], function (siErr, siRows) {
				if(siErr) {
					callbackDatas.message = "shop Info error";
					callbackDatas.success = 3;
					conn.release();
					callback(callbackDatas);
				} else {
					var shopDir = siRows[0].shopEnm;
					fs.move(image.path, 'public/shop/'+shopDir+'/'+image.filename, function (err){
						if (err) {
							console.error(err);
							callbackDatas.message = "file move error";
							callbackDatas.success = 3;
							conn.release();
							callback(callback);
						} else {
							datas.push(presetting.address()+'shop/'+shopDir+'/'+image.filename);
							datas.push('-');
							conn.query(shopSQL,datas,function (ssErr, ssRows){
								if(ssErr) {
									console.error('ssErr= ', ssErr);
									callbackDatas.message = "shop goods insert error";
									callbackDatas.success = 3;
									conn.release();
									callback(callbackDatas);
								} else {
									callbackDatas.success = 1;
									callbackDatas.message = "shop goods insert success";
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

exports.RequestList = function (page, callback) {
	var size = 10;
	var begin = (page -1) * size;

	var pageSize=10;//링크 10개를 보여준다.
	var startPage=Math.floor((page-1)/pageSize) * pageSize + 1;
	var endPage=startPage+(pageSize-1);

	var callbackDatas = {};
	var requestSelectSQL = "SELECT i.INTERIOR_TYPE AS interiorType, i.INTERIOR_NO AS interiorNo, i.INTERIOR_FLOW_STATUS AS interiorFlowStatus, DATE_FORMAT( i.INTERIOR_TIME,'%Y-%c-%d %H:%i') AS interiorTime, i.INTERIOR_USER_NM userNm, i.INTERIOR_USER_BILL AS interiorBill, i.INTERIOR_USER_PHONE AS userPhone, i.INTERIOR_USER_ADDRESS AS userAddress FROM INTERIOR AS i ORDER BY interiorTime DESC limit ?,?  ";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('connErr = ', connErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query('SELECT count(*) AS cnt FROM INTERIOR', function (cntErr, cntRows) {
				if(cntErr) {
					console.error('cntErr = ', cntErr);
					callbackDatas.message = "select sql error";
					callbackDatas.success = 3;
					conn.release();
					callback(callbackDatas);
				} else {
					var cnt = cntRows[0].cnt;
					var totalPage =Math.ceil(cnt/size); //전체페이지에서 나누기.
					if(endPage>totalPage){
						endPage=totalPage;
					}
					conn.query(requestSelectSQL, [begin, size],function (rsErr, rsRows ){
						if(rsErr) {
							console.error('rsErr= ', rsErr);
							callbackDatas.message = "request list error";
							callbackDatas.success = 3;
							conn.release();
							callback(callbackDatas);
						} else {
							callbackDatas.datas = {
								title:'리스트 ',
								page:page,
								pageSize:pageSize,
								startPage:startPage,
								endPage:endPage,
								totalPage:totalPage,
							};
							callbackDatas.results = rsRows;
							callbackDatas.success=1;
							callbackDatas.message = "request list success";
							conn.release();
							callback(callbackDatas);
						}
					});
				}
			});
		}
	})
}

exports.SelectImg = function (img, callback) {
	var callbackDatas = {};
	var inserImg = "INSERT INTO INTERIOR_IMG(INTERIOR_IMG_PATH,INTERIOR_IMG_NM) VALUES(?,?)";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			if(!img.length){	//사진 하나.
				fs.move(img.path, 'public/interiorImages/'+img.filename, function (err){
					if(err) {
						console.error('err = ', err);
						callbackDatas.message = "file move error";
						callbackDatas.success = 3;
						conn.release();
						callback(callback);
					} else {
						var imgPath = presetting.address()+'interiorImages/'+img.filename;
						conn.query(inserImg, [imgPath, 'select'], function (iiErr, iiRows) {
							console.log('this.query = ', this.query);
							if(iiErr) {
								console.error('iiErr= ', iiErr);
								callbackDatas.message = "insert image error";
								callbackDatas.success = 3;
								conn.release();
								callback(callbackDatas);
							} else {
								callbackDatas.success = 1;
								conn.release();
								callback(callbackDatas);
							}
						});
					}
				});
			} else {		//사진 여러개
				async.each(img, function (imgData, callback) {		//이미지들을 원하는 폴더로 이동.
					fs.move(imgData.path, 'public/interiorImages/'+imgData.filename, function (err){
						if(err) {
							console.error('err = ', err);
							callback();
						} else {
							var imgPath = presetting.address()+'interiorImages/'+img.filename;
							conn.query(inserImg, [imgData, 'select'], function (iiErr, iiRows) {
								callback();
							});
						}
					});
				}, function (err) {
					if(err) {
						console.error('err', err);
						callbackDatas.success = 3;
						conn.release();
						callback(callbackDatas);
					} else {
						callbackDatas.success = 1;
						conn.release();
						callback(callbackDatas);
					}
				});
			}
		}
	});
}

exports.requestUserInfo = function (userNo, callback) {
	var callbackDatas = {};
	var requestSelectSQL = "SELECT INTERIOR_TYPE AS interiorType, INTERIOR_NO AS interiorNo, INTERIOR_FLOW_STATUS AS interiorFlowStatus, DATE_FORMAT( INTERIOR_TIME,'%Y-%c-%d %H:%i') AS interiorTime, INTERIOR_USER_NM userNm, INTERIOR_USER_BILL AS interiorBill, INTERIOR_USER_PHONE AS userPhone, INTERIOR_USER_ADDRESS AS userAddress, INTERIOR_IMAGES AS interiorImages, INTERIOR_ROOM_IMG AS interiorRoomImages, INTERIOR_USER_HOUSING AS userHousing, INTERIOR_USER_EMAIL AS userEmail, INTERIOR_USER_MESSAGE AS userMessage, INTERIOR_OFFLINE AS offline, INTERIOR_CONTRACTORS AS contractors, INTERIOR_CONCEPT AS concept, INTERIOR_AGE AS age, INTERIOR_FUNNEL AS funnel, INTERIOR_STYLING_PERIOD AS stylingPeriod, INTERIOR_SPACE_NO AS spaceNo, INTERIOR_ESTIMATE AS interiorEstimate, INTERIOR_MANAGER AS manager, INTERIOR_MANAGER_PHONE AS managerPhone, INTERIOR_USER_INFO AS userInfo, INTERIOR_MOVE AS userMove, INTERIOR_CONSTRUCTION AS userConstruction, INTERIOR_USER_HOUSING AS userHousing, INTERIOR_USER_PHONETIME AS phoneTime, INTERIOR_USER_SEX AS userSex, INTERIOR_SPACE_INFO AS spaceInfo FROM INTERIOR WHERE INTERIOR_NO=? ";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(requestSelectSQL, userNo, function (rsErr, rsRow) {
				if (rsErr ) {
					console.error('rsErr= ', rsErr);
					callbackDatas.message = "request select error";
					callbackDatas.success = 3;
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.interiorImages = rsRow[0].interiorImages.split(',');
					callbackDatas.interiorRoomImages = rsRow[0].interiorRoomImages.split(',');
					rsRow[0].interiorImages = null;
					rsRow[0].interiorRoomImages = null;
					callbackDatas.results = rsRow[0];
					callbackDatas.success = 1;
					callbackDatas.message = "success";
					conn.release();
					callback(callbackDatas);
				}
			})
		}
	});

}
exports.requestUserInfoUpdate = function (datas,callback) {
	var callbackDatas = {};
	var requestUpdateSQL = 'UPDATE INTERIOR SET INTERIOR_CONTRACTORS=?,  INTERIOR_USER_ADDRESS=?,  INTERIOR_OFFLINE=?,INTERIOR_FUNNEL=?, INTERIOR_MANAGER=?, INTERIOR_MANAGER_PHONE =?, INTERIOR_SPACE_NO=?, INTERIOR_ESTIMATE=?, INTERIOR_STYLING_PERIOD=?, INTERIOR_FLOW_STATUS=? , INTERIOR_USER_INFO=? WHERE INTERIOR_NO=?';
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas );
		} else {
			conn.query(requestUpdateSQL, datas, function (ruErr, ruRow) {
				if (ruErr ) {
					console.error('ruErr= ', ruErr);
					callbackDatas.message = "request update error";
					callbackDatas.success = 3;
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.message= "request update success";
					callbackDatas.success = 1;
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}