var mysql = require('mysql');
var async = require('async');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.productInfo = function (productNo, callback) {
	var callbackDatas = {};
	callbackDatas.results = { "productImage" : [], "productNo" : 0,
"productNm" : " ", "productPrice" : 0, "productInfo" : " "};
	callbackDatas.success = 3;
	callbackDatas.message = "product info fail";

	var productImageSQL = "SELECT pimg.PRODUCT_IMG_PATH AS imagePath, pimg.PRODUCT_IMG_INFO AS imageInfo FROM PRODUCT_IMG pimg WHERE pimg.PRODUCT_NO=?";
	var productInfoSQL = "SELECT p.PRODUCT_NO AS productNo, p.PRODUCT_NM AS productNm, p.PRODUCT_PRICE AS productPrice, p.PRODUCT_INFO AS productInfo FROM PRODUCT p WHERE p.PRODUCT_NO=?";

	pool.getConnection(function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr);
			callbackDatas.message = "get Connection error";
			callback(callbackDatas);
		} else {
			conn.query(productInfoSQL, productNo, function (piErr, piRow) {
				if(piErr) {
					console.error('piErr = ', piErr);
					conn.release();
					callback(callbackDatas);
				} else {
					conn.query(productImageSQL, productNo, function (pimgErr, pimgRows) {
						if(pimgErr) {
							console.error('pimgErr = ', pimgErr);
							conn.release();
							callback(callbackDatas);
						} else {
							callbackDatas.results = piRow[0];
							callbackDatas.results.productImage = pimgRows;
							callbackDatas.success = 1;
							callbackDatas.message = "product info success";
							conn.release();
							callback(callbackDatas);
						}
					});
				}
			});
		}
	});
}

exports.addCart = function (productNo, userNo, productCount, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "add to cart fail";
	var addCartSQL = "INSERT INTO CART(PRODUCT_NO, USERS_NO,PRODUCT_COUNT) VALUES(?,?,?);"
	pool.getConnection(function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr);
			callbackDatas.message = "get Connection error";
			callback(callbackDatas);
		} else {
			conn.query(addCartSQL, [productNo, userNo, productCount], function (acErr, acRow) {
				if(acErr) {
					console.error(acErr);
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.success = 1;
					callbackDatas.message = "add to cart success";
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}

exports.viewCart = function (userNo, page, callback) {
 	var callbackDatas = {};
 	callbackDatas.success = 3;
 	callbackDatas.results = [];
 	callbackDatas.message = "my cart fail";

 	var cartListSQL = "SELECT p.PRODUCT_NO AS productNo, p.PRODUCT_REP_IMG AS productImage, p.PRODUCT_NM AS productNm, p.PRODUCT_PRICE AS productPrice, p.PRODUCT_INFO AS productInfo, c.PRODUCT_COUNT AS productCount FROM CART AS c, PRODUCT AS p WHERE c.USERS_NO=? AND c.PRODUCT_NO=p.PRODUCT_NO";

 	pool.getConnection(function (connErr, conn) {
 		if(connErr) {
 			console.error('connErr = ', connErr );
 			callbackDatas.message = "get Connection error";
 			callback(callbackDatas);
 		} else {
 			conn.query(cartListSQL, userNo, function (clErr, clRows) {
 				if(clErr) {
 					console.error('clErr = ', clErr);
 					conn.release();
 					callback(callbackDatas);
 				} else {
 					var pageDatas = presetting.pageSetting(page, 10, clRows);
 					if(pageDatas.length == 0) {
 						callbackDatas.message = "page over";
 						callbackDatas.success = 2;
 						conn.release();
 						callback(callbackDatas);
 					} else {
 						callbackDatas.message = "my cart success";
 						callbackDatas.success = 1;
 						callbackDatas.results = pageDatas;
 						conn.release();
 						callback(callbackDatas);
 					}
 				}
 			});
 		}
 	});
}

exports.myDInfo = function ( userNo, callback ) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.results = {"userNm" : " ", "userAdd" : " ", "userPhone" : "00000000"}
	callbackDatas.message = "my delivery info fail";
	var myInfoSQL = "SELECT USERS_NM AS userNm, USERS_ADD AS userAdd, USERS_PHONE AS userPhone FROM USERS WHERE USERS.USERS_NO=?"

	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas);
		} else {
			conn.query(myInfoSQL, userNo, function (miErr, miRow) {
				if(miErr) {
					console.error('miErr = ', miErr);
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.success = 1;
					callbackDatas.message = "my delivery info success";
					callbackDatas.results = miRow[0];
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}

//var datas = [userNo, userNm, userAdd, userPhone, price, list];
exports.purchaseInfo = function (datas, callback) {
	var plist = datas.pop();
	var purchaseInfo = '';
	for(var i = 0; i<plist.length; i++ ){
		purchaseInfo += plist[i]+'_';
	}
	purchaseInfo = purchaseInfo.substring(0,purchaseInfo.length-1);
	datas.push(purchaseInfo);
	console.log('datas = ', datas)
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "my purchase info fail"
	var purchaseInfoSQL = "INSERT INTO PURCHASE(USERS_NO, PURCHASE_NM, PURCHASE_ADD,PURCHASE_PHONE,PURCHASE_PRICE,PURCHASE_INFO, PURCHASE_TIME) VALUES(?,?,?,?,?,?, NOW())";
	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas);
		} else {
			conn.query(purchaseInfoSQL, datas, function (piErr, piRows) {
				if(piErr) {
					console.error('piErr = ', piErr);
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.success = 1;
					callbackDatas.message = "my purchase info success";
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}

exports.purchaseList = function (userNo, page, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "my purchase list fail"
	callbackDatas.results = [];

	var purchaseListSQL = "SELECT p.PURCHASE_NO AS purchaseNo, DATE_FORMAT(p.PURCHASE_TIME,'%Y-%c-%d %H:%i:%s') AS purchaseTime, p.PURCHASE_PRICE AS purchasePrice, p.PURCHASE_STATUS AS purchaseStatus FROM PURCHASE p WHERE p.USERS_NO=? ORDER BY purchaseTime DESC";

	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas);
		} else {
			conn.query(purchaseListSQL, userNo, function (plErr, plRows) {
				if(plErr) {
					console.error('plErr = ', plErr);
					conn.release();
					callback(callbackDatas);
				} else {
					var pageDatas = presetting.pageSetting(page, 10, plRows);
					if(pageDatas.length == 0) {
						callbackDatas.success = 2;
						callbackDatas.message = "page over";
						conn.release();
						callback(callbackDatas);
					} else {
						callbackDatas.success = 1;
						callbackDatas.message = "my purchase list success";
						callbackDatas.results = pageDatas;
						conn.release();
						callback(callbackDatas);
					}
				}
			});
		}
	});
}

// products = [1-2, 23-2]
exports.productsInfo = function ( products, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "my products info fail"
	callbackDatas.results = [];
	var productResults = [];
	var productInfoSQL = "SELECT p.PRODUCT_NO AS productNo, p.PRODUCT_NM AS productNm, p.PRODUCT_PRICE AS productPrice, p.PRODUCT_INFO AS productInfo, ? AS productCount FROM PRODUCT p WHERE p.PRODUCT_NO=?";

	pool.getConnection(function (conErr, conn) {
		if(conErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callback(callbackDatas);
		} else {
			async.each(products, function( product, callback ){
				var productToken = product.split('-');
				conn.query(productInfoSQL, [productToken[1], productToken[0]], function (piErr, piRow) {
					if(piErr) {
						console.error('piErr = ', piErr);
						callback('piErr = '+ piErr);
					} else {
						productResults.push(piRow[0]);
						callback();
					}
				});
			}, function (err) {
				if(err) {
					conn.release();
					callback(callbackDatas);
				} else {
					callbackDatas.message = "my products info success";
					callbackDatas.success = 1;
					callbackDatas.results = productResults;
					conn.release();
					callback(callbackDatas);
				}
			});
		}
	});
}