var mysql = require('mysql');
var fs = require('fs-extra');
var async = require('async');
var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

exports.shopList = function (userNo,page, callback ) {
	var callbackDatas = {};

	var shopListSQL = "SELECT repImg, shopNo, shopNm, shopLogo, shopInfo,shopUrl, (SELECT DISTINCT 1 FROM SHOP_LIKES sl WHERE EXISTS( SELECT SL_NO FROM SHOP_LIKES AS sl WHERE sl.USERS_NO=? AND shopList.shopNo = sl.SHOP_NO)) AS likeStatus FROM (SELECT SHOP_NO AS shopNo, SHOP_NM AS shopNm, SHOP_LOGO AS shopLogo, SHOP_INFO AS shopInfo, SHOP_URL AS shopUrl, SHOP_REP_IMG AS repImg FROM SHOP) AS shopList"
	pool.getConnection ( function (connErr, conn) {
 		if(connErr) {
 			console.error('connErr = ', connErr );
	 		callbackDatas.message = "get Connection error";
	 		callbackDatas.results = {"userNo" : 0, "userEmail" : datas[0], "userNick" : datas[2] };
	 		callbackDatas.success = 3;
	 		callback(callbackDatas );
	 	} else {
	 		conn.query(shopListSQL, userNo,function (slErr, slRows) {
	 			if (slErr) {
	 				console.error('slErr = ', slErr);
	 				callbackDatas.message = "shop list fail";
	 				callbackDatas.success = 3;
	 				callbackDatas.results = [];
	 				conn.release();
	 				callback(callbackDatas);
	 			} else {
	 				var shopSize = slRows.length;
	 				var pageDatas = presetting.pageSetting(page, 15, slRows);
	 				if(pageDatas.length == 0) {
						callbackDatas.success = 2;
						callbackDatas.message = "page over";
						callbackDatas.results = [];
						conn.release();
						callback(callbackDatas);
					} else {
						for (var i = 0; i< pageDatas.length; i++) {
							if(pageDatas[i].likeStatus == null) {
								pageDatas[i].likeStatus = 0;
							}
						}
						callbackDatas.message = "shop list success";
						callbackDatas.success = 1;
						callbackDatas.results = pageDatas;
						callbackDatas.shopSize = shopSize;
						conn.release();
						callback(callbackDatas);
					}
	 			}
	 		});
	 	}
	 });
}

// datas = [userNo, shopNo];
exports.shopGoods = function (datas, page, callback) {
	var callbackDatas = {};
	callbackDatas.results = { "shopNo" : 0,
													"shopInfo" : "없음",
													"shopNm" : "없음",
													"shopLogo": "없음",
													"goods" : [],
													"shopUrl" : "~~"
													};
	var shopCountSQL = "UPDATE SHOP SET SHOP_CNT = SHOP_CNT+1 WHERE SHOP_NO=?";
	var shopGoodsListSQL = "SELECT shopNo, shopGoodsNo, shopGoodsInfo, shopGoodsPrice, shopGoodsNm, shopGoodsImg,goodsUrl ,(SELECT 1 FROM SHOP_GOODS_LIKES sgl WHERE EXISTS(SELECT SPL_NO FROM SHOP_GOODS_LIKES WHERE sgl.USERS_NO=? AND shopGoods.shopGoodsNo=sgl.SHOP_GOODS_NO )) AS likeStatus FROM (SELECT SHOP_NO AS shopNo, SHOP_GOODS_NO AS shopGoodsNo, SHOP_GOODS_INFO AS shopGoodsInfo, SHOP_GOODS_PRICE AS shopGoodsPrice, SHOP_GOODS_NM AS shopGoodsNm, SHOP_GOODS_IMG AS shopGoodsImg, SHOP_GOODS_URL AS goodsUrl FROM SHOP_GOODS WHERE SHOP_NO=?) AS shopGoods"
	var shopInfoSQL = "SELECT SHOP_NM AS shopNm, SHOP_INFO AS shopInfo, SHOP_LOGO AS shopLogo, SHOP_NO AS shopNo, SHOP_URL AS shopUrl FROM SHOP WHERE SHOP_NO=?";
	pool.getConnection ( function (connErr, conn) {
 		if(connErr) {
 			console.error('connErr = ', connErr );
	 		callbackDatas.message = "get Connection error";
	 		callbackDatas.results = {"userNo" : 0, "userEmail" : datas[0], "userNick" : datas[2]};
	 		callbackDatas.success = 3;
	 		callback(callbackDatas );
	 	} else {
	 		conn.query(shopCountSQL, datas[1], function (scErr, scRow) {
	 			if(scErr) {
	 				console.error("scErr = ", scErr);
				 	callbackDatas.message = "shop goods fail";
					conn.release();
				 	callbackDatas.success = 3;
				 	callback(callbackDatas);
	 			} else {
	 				conn.query(shopGoodsListSQL, datas, function (sglErr, sglRows){
	 					if(sglErr) {
			 				console.error("sglErr = ", sglErr);
						 	callbackDatas.message = "shop goods fail";
						 	callbackDatas.success = 3;
	 						conn.release();
						 	callback(callbackDatas);
	 					} else {
			 				var pageDatas = presetting.pageSetting(page, 20, sglRows);
			 				if(pageDatas.length == 0) {
								callbackDatas.success = 2;
								callbackDatas.message = "page over";
								conn.release();
								callback(callbackDatas);
							} else {
								for (var i = 0; i< pageDatas.length; i++) {
									if(pageDatas[i].likeStatus == null) {
										pageDatas[i].likeStatus = 0;
									}
								}
								conn.query(shopInfoSQL, datas[1], function (siErr, siRows) {
									if(sglErr) {
						 				console.error("siErr = ", siErr);
									 	callbackDatas.message = "shop goods fail";
				 						conn.release();
									 	callbackDatas.success = 3;
									 	callback(callbackDatas);
				 					} else {
				 						callbackDatas.message = "shop goods success";
				 						callbackDatas.results = { "shopNo" : siRows[0].shopNo,
				 																		"shopInfo" : siRows[0].shopInfo,
				 																		"shopNm" : siRows[0].shopNm,
				 																		"shopLogo": siRows[0].shopLogo,
				 																		"goods" : pageDatas,
				 																		"shopUrl" : siRows[0].shopUrl
				 																		};
				 						callbackDatas.success = 1;
				 						conn.release();
				 						callback(callbackDatas);
				 					}
								})
							}
	 					}
	 				})
	 			}
	 		});
	 	}
	});
}

//datas = [userNo, goodsNo]
exports.goodsLike = function (datas, callback) {
	var callbackDatas = {};
	callbackDatas.results = {};
	callbackDatas.message = "shop goods like fail";
	callbackDatas.success = 3;
	var goodsStatusSQL = "SELECT * FROM SHOP_GOODS_LIKES WHERE USERS_NO=? AND SHOP_GOODS_NO=?";
	var goodsLikeSQL = "INSERT INTO SHOP_GOODS_LIKES( USERS_NO,SHOP_GOODS_NO, SPL_TIME) VALUES(?,?,NOW())";
	var goodsUnlikeSQL = "DELETE FROM SHOP_GOODS_LIKES WHERE USERS_NO=? AND SHOP_GOODS_NO=?";
	pool.getConnection (function (connErr, conn) {
		conn.query(goodsStatusSQL, datas, function (gsErr, gsRows) {
			if (gsErr) {
				console.error('gsErr = ', gsErr);
				conn.release();
				callback(callbackDatas);
			} else {
				if(gsRows.length == 0) {	//좋아요 하기
					conn.query(goodsLikeSQL, datas, function (glErr, glRows) {
						if(glErr){
							console.error('glErr = ', glErr);
							conn.release();
							callback(callbackDatas);
						} else {
							conn.release();
							callbackDatas.success = 1;
							callbackDatas.message = 'goods like success';
							callback(callbackDatas);
						}
					});
				} else {									//좋아요 취소 하기
					conn.query(goodsUnlikeSQL, datas, function (gulErr, gulRows) {
						if(gulErr){
							console.error('gulErr = ', gulErr);
							conn.release();
							callback(callbackDatas);
						} else {
							conn.release();
							callbackDatas.success = 1;
							callbackDatas.message = 'goods like cancel success';
							callback(callbackDatas);
						}
					});
				}
			}
		});
	});
}

exports.goodsLikeStatus = function (datas, callback) {
	var shopGoodsStatusSQL = "SELECT * FROM SHOP_GOODS_LIKES AS sgl WHERE sgl.USERS_NO=? AND sgl.SHOP_GOODS_NO=?";
	pool.getConnection (function (connErr, conn) {
		if(connErr) {
			console.error("get Connection Err");
			conn.release();
			callback(callbackDatas);
		} else {
			conn.query(shopGoodsStatusSQL, datas, function (sgsErr, sgsRows) {
				conn.release();
				if(sgsErr) {
					console.error("sgsErr = ", sgsErr);

					callback({"message" : "goods like status fail",
										"success" : 3});
				} else if(sgsRows.length == 0){
					callback({
						"success" : 1,
						"message" : "no"
					});
				} else {
					callback({
						"success" : 1,
						"message" : "yes"
					});
				}
			});
		}
	});
}

exports.likeList = function (userNo, page, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "like list fail";
	callbackDatas.results = [];
	var likeListSQL = "SELECT sg.SHOP_GOODS_NO AS shopGoodsNo, sg.SHOP_GOODS_INFO AS shopGoodsInfo, sg.SHOP_GOODS_PRICE AS shopGoodsPrice, sg.SHOP_GOODS_NM AS shopGoodsNm, sg.SHOP_GOODS_IMG AS shopGoodsImg, sg.SHOP_GOODS_URL as goodsUrl FROM SHOP_GOODS_LIKES AS sgl, SHOP_GOODS AS sg WHERE sgl.SHOP_GOODS_NO = sg.SHOP_GOODS_NO AND sgl.USERS_NO=?";

	pool.getConnection (function (connErr, conn) {
		if(connErr) {
			console.error("get Connection Err");
			callback(callbackDatas);
		} else {
			conn.query(likeListSQL, userNo, function (llErr, llRows) {
				if(llErr) {
					console.error('llErr = ', llErr);
					conn.release();
					callback(callbackDatas);
				} else {
					pageDatas = presetting.pageSetting(page, 10, llRows);
					callbackDatas.message = "like list success";
					callbackDatas.success = 1;
					callbackDatas.results = pageDatas;
					conn.release();
					callback(callbackDatas)
				}
			});
		}
	});
}

exports.shopFavorite = function (datas, callback) {
	var callbackDatas = {};
	callbackDatas.results = {};
	callbackDatas.message = "shopFavorite like fail";
	callbackDatas.success = 3;
	var shopStatusSQL = "SELECT * FROM SHOP_LIKES WHERE USERS_NO=? AND SHOP_NO=?";
	var shopLikeSQL = "INSERT INTO SHOP_LIKES( USERS_NO,SHOP_NO, SL_TIME) VALUES(?,?,NOW())";
	var shopUnlikeSQL = "DELETE FROM SHOP_LIKES WHERE USERS_NO=? AND SHOP_NO=?";
	pool.getConnection (function (connErr, conn) {
		conn.query(shopStatusSQL, datas, function (ssErr, ssRows) {
			if (ssErr) {
				console.error('ssErr = ', ssErr);
				conn.release();
				callback(callbackDatas);
			} else {
				if(ssRows.length == 0) {	//좋아요 하기
					conn.query(shopLikeSQL, datas, function (slErr, slRows) {
						if(slErr){
							console.error('slErr = ', slErr);
							conn.release();
							callback(callbackDatas);
						} else {
							conn.release();
							callbackDatas.success = 1;
							callbackDatas.message = 'shopFavorite like success';
							callback(callbackDatas);
						}
					});
				} else {									//좋아요 취소 하기
					conn.query(shopUnlikeSQL, datas, function (sulErr, sulRows) {
						if(sulErr){
							console.error('sulErr = ', sulErr);
							conn.release();
							callback(callbackDatas);
						} else {
							conn.release();
							callbackDatas.success = 1;
							callbackDatas.message = 'shopFavorite like cancel success';
							callback(callbackDatas);
						}
					});
				}
			}
		});
	})
}

exports.shopFavoriteStatus = function (datas, callback) {
	var shopFavoriteStatusSQL = "SELECT * FROM SHOP_LIKES AS sl WHERE sl.USERS_NO=? AND sl.SHOP_NO=?";
	pool.getConnection (function (connErr, conn) {
		if(connErr) {
			console.error("get Connection Err");
			conn.release();
			callback(callbackDatas);
		} else {
			conn.query(shopFavoriteStatusSQL, datas, function (sfsErr, sfsRows) {
				conn.release();
				if(sfsErr) {
					console.error("sfsErr = ", sfsErr);
					callback({"message" : "shop like status fail",
										"success" : 3});
				} else if(sfsRows.length == 0){
					callback({
						"success" : 1,
						"message" : "no"
					});
				} else {
					callback({
						"success" : 1,
						"message" : "yes"
					});
				}
			});
		}
	})
}

exports.favoriteList = function (userNo,page, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = "favorite list fail";
	callbackDatas.results = [];
	var favoriteListSQL = "SELECT s.SHOP_NO AS shopNo, s.SHOP_INFO AS shopInfo, s.SHOP_LOGO AS shopLogo, s.SHOP_NM AS shopNm,s.SHOP_REP_IMG AS repImg, s.SHOP_URL as shopUrl FROM SHOP_LIKES AS sl, SHOP AS s WHERE sl.SHOP_NO = s.SHOP_NO AND sl.USERS_NO=?";

	pool.getConnection (function (connErr, conn) {
		if(connErr) {
			console.error("get Connection Err");
			conn.release();
			callback(callbackDatas);
		} else {
			conn.query(favoriteListSQL, userNo, function (flErr, flRows) {
				if(flErr) {
					console.error('flErr = ', flErr);
					conn.release();
					callback(callbackDatas);
				} else {
					pageDatas = presetting.pageSetting(page, 10, flRows);
					callbackDatas.message = "favorite list success";
					callbackDatas.success = 1;
					callbackDatas.results = pageDatas;
					conn.release();
					callback(callbackDatas)
				}
			});
		}
	});
}
