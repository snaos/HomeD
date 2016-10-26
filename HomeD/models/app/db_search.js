var mysql = require('mysql');
var async = require('async');

var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);

// keyword로 검색.
// keyword는 '_'를 통해서 split함.
exports.tagSaerchKeyword = function (userNo,keyword, page, callback) {
	var keywords = keyword.split("_");
	var callbackDatas = {};
	var preSearchSQL = "SELECT DISTINCT postNo, postImage, postTime, userNick, userImage, postBuy, postImageNum FROM ( ";
	var searchSQL = "SELECT postNo, postImage, postTime, userNick, userImage, postBuy, ( SELECT COUNT(*) FROM POSTS AS p, POSTS_IMG AS pimg WHERE p.POSTS_NO=pimg.POSTS_NO AND p.POSTS_NO=searchResults.postNo ) AS postImageNum FROM (SELECT p.POSTS_NO AS postNo, p.POSTS_REP_IMG AS postImage, date_format(p.POSTS_TIME,'%Y-%c-%d %H:%i:%s') AS postTime , u.USERS_NICK AS userNick, u.USERS_IMG_PATH AS userImage, p.POSTS_BUY AS postBuy FROM POSTS p, TAGS t, POSTS_TAGS pt, USERS u WHERE p.USERS_NO=u.USERS_NO AND pt.POSTS_NO=p.POSTS_NO AND pt.TAGS_NO=t.TAGS_NO AND t.TAGS_NM LIKE ? ) AS searchResults ORDER BY postNo DESC";
	var middleSearchSQL1 = " ) AS ";
	var middleSearchSQL2 = ", POSTS_TAGS  AS pt , TAGS t where t.TAGS_NO=pt.TAGS_NO AND ";
	var endSearchSQL = ".postNo=pt.POSTS_NO AND t.TAGS_NM LIKE ?";
	var tagsSQL = 'SELECT t.TAGS_NM as tagNm FROM POSTS_TAGS pt, TAGS t  WHERE pt.TAGS_NO = t.TAGS_NO AND pt.POSTS_NO=?';

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas);
		} else {
			if(keywords.length == 1) {	//키워드 하나
				keywords[0] = "%"+keywords[0]+"%";
			} else {										//키워드 여러개
				for(var i = 0; i<keywords.length-1; i++) {
					var tableName = "k"+i;
					searchSQL = preSearchSQL + searchSQL + middleSearchSQL1 + tableName + middleSearchSQL2 + tableName + endSearchSQL;
					keywords[i] = '%'+keywords[i]+'%';
				}
				keywords[keywords.length-1] = '%' + keywords[keywords.length-1] +'%'
			}
			conn.query(searchSQL, keywords, function (searchErr, searchRows) {
				if(searchErr) {
					console.error('searchErr = ', searchErr);
					callbackDatas.success = 3;
					callbackDatas.message = "search list fail";
					callbackDatas.results = [];
					conn.release();
					callback(callbackDatas);
				} else {
					var pageDatas = presetting.pageSetting(page, 10, searchRows);
					if(pageDatas.length == 0){
						conn.release();
						callbackDatas.message = "page over";
						callbackDatas.success = 2;
						callbackDatas.results = [];
						callback(callbackDatas);
					} else {
						async.each(pageDatas, function (datas, callback) {
							var tags = [];
							conn.query(tagsSQL, datas.postNo, function (tagErr, tagRows) {
								for(var i = 0; tagRows.length>i; i++){
									tags.push(tagRows[i].tagNm);
								}
								datas.postTags = tags;
								callback();
							});
						}, function (err) {
							callbackDatas.sucess = 1;
							callbackDatas.results = pageDatas;
							callbackDatas.message = 'search list success';
							conn.release();
							callback(callbackDatas);
						});
					}
				}
			});
		}
	});
}


exports.shopSaerchKeyword = function ( userNo,keyword, page, callback) {
	var callbackDatas = {};
	var shopSearchSQL = 'SELECT *, (SELECT 1 FROM SHOP_LIKES sl WHERE EXISTS( SELECT SL_NO FROM SHOP_LIKES WHERE sl.USERS_NO=? AND shopSearch.shopNo = sl.SHOP_NO)) AS likeStatus FROM (SELECT s.SHOP_NO AS shopNo, s.SHOP_NM AS shopNm, s.SHOP_LOGO AS shopLogo, s.SHOP_INFO AS shopInfo, s.SHOP_URL AS shopUrl FROM SHOP AS s WHERE s.SHOP_NM LIKE ?) AS shopSearch';
	keyword = '%' + keyword + '%';
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas);
		} else {
			conn.query(shopSearchSQL, [ userNo,keyword], function (ssErr, ssRows) {
				if(ssErr) {
					console.error('ssErr = ', ssErr);
					callbackDatas.success = 3;
					callbackDatas.message = "search list fail";
					callbackDatas.results = [];
					conn.release();
					callback(callbackDatas);
				} else {
					var pageDatas = presetting.pageSetting(page, 10, ssRows);
					if(pageDatas.length == 0) {
						callbackDatas.message = "page over";
						callbackDatas.success = 2;
						callbackDatas.results = [];
						conn.release();
						callback(callbackDatas);
					} else {
						for(var i = 0; i < pageDatas.length; i++) {
							if(!pageDatas[i].likeStatus) {
								pageDatas[i].likeStatus = 0;
							}
						}
						callbackDatas.success = 1;
						callbackDatas.message = "search list success";
						callbackDatas.results = pageDatas;
						conn.release();
						callback(callbackDatas);
					}
				}
			});
		}
	});
}


exports.goodsSaerchKeyword = function ( userNo, keyword, page, callback) {
	var callbackDatas = {};
	var goodsSearchSQL = 'SELECT *, (SELECT 1 FROM SHOP_GOODS_LIKES sgl WHERE EXISTS( SELECT SL_NO FROM SHOP_LIKES WHERE sgl.USERS_NO=? AND goodsSearch.shopGoodsNo =sgl.SHOP_GOODS_NO)) AS likeStatus FROM (SELECT sg.SHOP_NO AS shopNo, s.SHOP_NM AS shopNm, sg.SHOP_GOODS_NO AS shopGoodsNo, sg.SHOP_GOODS_INFO AS shopGoodsInfo, sg.SHOP_GOODS_PRICE AS shopGoodsPrice, sg.SHOP_GOODS_NM AS shopGoodsNm, sg.SHOP_GOODS_IMG AS shopGoodsImg, sg.SHOP_GOODS_URL AS shopGoodsUrl FROM SHOP_GOODS AS sg,SHOP AS s WHERE sg.SHOP_NO=s.SHOP_NO AND sg.SHOP_GOODS_NM LIKE ?) goodsSearch';
		keyword = '%' + keyword + '%';
		pool.getConnection ( function (connErr, conn) {
			if(connErr) {
				console.error('conErr = ', conErr );
				callbackDatas.message = "get Connection error";
				callbackDatas.results = [];
				callbackDatas.success = 3;
				callback(callbackDatas);
			} else {
				conn.query(goodsSearchSQL,[userNo, keyword], function (gsErr, gsRows) {
					if(gsErr) {
						console.error('gsErr = ', gsErr);
						callbackDatas.success = 3;
						callbackDatas.message = "search list fail";
						callbackDatas.results = [];
						conn.release();
						callback(callbackDatas);
					} else {
						var pageDatas = presetting.pageSetting(page, 10, gsRows);
						if(pageDatas.length == 0) {
							callbackDatas.message = "page over";
							callbackDatas.success = 2;
							callbackDatas.results = [];
							conn.release();
							callback(callbackDatas);
						} else {
							for(var i = 0; i < pageDatas.length; i++) {
								if(!pageDatas[i].likeStatus) {
									pageDatas[i].likeStatus = 0;
								}
							}
							callbackDatas.success = 1;
							callbackDatas.message = "search list success";
							callbackDatas.results = pageDatas;
							conn.release();
							callback(callbackDatas);
						}
					}
				});
			}
		});
}