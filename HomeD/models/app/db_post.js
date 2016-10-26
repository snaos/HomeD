var mysql = require('mysql');
var fs = require('fs-extra');
var async = require('async');
var imagemagick = require('imagemagick')
var presetting = require('../presettings');
var pool =  presetting.mysql_pool(mysql);


exports.viewDetails = function (userNo, postNo, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'posts view details fail';
	callbackDatas.results = { "postNo" : 0, "postTime" : " ", "userNick" : " ","userNo" : 0, "userImage" : "~", "postTags" : [], "postContents" : "~~", "postComments" : [], "postBuy" : 0, "postImages" : [], "postLikes" : 0 , "postComments" : 0, "likeStatus" : 0  };

	var viewDetailSQL = "SELECT postNo, postTime, userNick, userImage, postBuy, postContents, userNo, (SELECT COUNT(*) FROM LIKES l, POSTS p WHERE l.POSTS_NO=p.POSTS_NO AND p.POSTS_NO=viewPost.postNo ) AS postLikes, (SELECT 1 FROM LIKES l WHERE EXISTS( SELECT LIKES_NO FROM LIKES WHERE l.USERS_NO=? AND viewPost.postNo = l.POSTS_NO)) AS likeStatus, (SELECT COUNT(*) FROM COMMENTS c, POSTS p WHERE p.POSTS_NO=viewPost.postNo AND c.POSTS_NO=p.POSTS_NO) AS postComments FROM (SELECT p.POSTS_NO AS postNo, u.USERS_NICK AS userNick, DATE_FORMAT(p.POSTS_TIME, '%Y-%c-%d %H:%i:%s') AS postTime,u.USERS_NO AS userNo,u.USERS_IMG_PATH AS userImage, p.POSTS_CONTENTS AS postContents, p.POSTS_BUY AS postBuy FROM POSTS AS p, USERS AS u WHERE p.POSTS_NO=? AND p.USERS_NO=u.USERS_NO) AS viewPost";
	var postImagesSQL = "SELECT pimg.POSTS_IMG_PATH AS imagePath, pimg.POSTS_IMG_INFO AS imageInfo FROM POSTS_IMG AS pimg WHERE pimg.POSTS_NO=?";
	var postTagsSQL = "SELECT t.TAGS_NM AS postTags FROM POSTS_TAGS pt, TAGS t WHERE pt.TAGS_NO=t.TAGS_NO AND pt.POSTS_NO=?";
	var postCommentsSQL = "SELECT c.COMMENTS_NO AS commentsNo, u.USERS_NICK AS userNick,  DATE_FORMAT(c.COMMENTS_TIME, '%Y-%c-%d %H:%i:%s') AS commentsTime, c.COMMENTS_CONTENTS AS commentsContents FROM COMMENTS c, USERS u WHERE c.POSTS_NO=? AND u.USERS_NO=c.USERS_NO ORDER BY commentsTime DESC LIMIT 5";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.results = [];
			callbackDatas.success = 3;
			callback(callbackDatas);
		} else {
			conn.query(viewDetailSQL, [userNo, postNo], function (vdErr, vdRows) {
				if(vdErr) {
					console.error('vdErr = ', vdErr);
					conn.release();
					callback(callbackDatas);
				} else {
					if(vdRows[0].likeStatus == null) {
						vdRows[0].likeStatus = 0;
					}
					conn.query(postImagesSQL, postNo, function (piErr, piRows) {
						if(piErr) {
							console.error('piErr = ', piErr);
							conn.release();
							callback(callbackDatas);
						} else {
							vdRows[0].postImages = piRows;
							conn.query(postTagsSQL, postNo, function (ptErr, ptRows) {
								if(ptErr) {
									console.error('ptErr = ', ptErr);
									conn.release();
									callback(callbackDatas);
								} else {
									var tags = [];
									for(var i = 0; i<ptRows.length; i++) {
										tags.push(ptRows[i].postTags)
									}
									vdRows[0].postTags = tags;
									conn.query(postCommentsSQL, postNo, function (pcErr, pcRows) {
										if(pcErr) {
											console.error('pcErr = ', pcErr);
											conn.release();
											callback(callbackDatas);
										} else {
											vdRows[0].postComments = pcRows;
											conn.release();
											callbackDatas.message = "post view Details success";
											callbackDatas.success = 1;
											callbackDatas.results = vdRows[0];
											callback(callbackDatas);
										}
									});
								}
							})
						}
					});
				}
			});
		}
	});
}

exports.doLike = function (userNo, postNo, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'posts like fail';
	var findLikeSQL = "SELECT * FROM LIKES WHERE USERS_NO=? AND POSTS_NO = ?";
	var deleteLikeSQL = "DELETE FROM LIKES WHERE LIKES_NO=?";
	var insertLikeSQL = "INSERT INTO LIKES(USERS_NO, POSTS_NO, LIKES_TIME) VALUES(?,?, NOW())";
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas);
		} else {
			conn.query(findLikeSQL, [userNo, postNo], function (flErr, flRows) {
				if (flErr){
					console.error('flErr = ', flErr);
					conn.release();
					callback(callbackDatas);
				} else {
					if(flRows.length != 0 ) {		// 검색결과 있으면 delete
						conn.query(deleteLikeSQL, flRows[0].LIKES_NO, function (dlErr, dlRows) {
							if(dlErr) {
								console.error('dlErr = ', dlErr);
								conn.release();
								callback(callbackDatas);
							} else {
								callbackDatas.message = 'posts like cancel success';
								callbackDatas.success = 1;
								conn.release();
								callback(callbackDatas);
							}
						});
					} else {		// 검색 결과 없으면 insert
						conn.query(insertLikeSQL, [userNo, postNo], function (ilErr, ilRows) {
							if(ilErr) {
								console.error('ilErr = ', ilErr);
								conn.release();
								callback(callbackDatas);
							} else {
								callbackDatas.message = 'posts like success';
								callbackDatas.success = 1;
								conn.release();
								callback(callbackDatas);
							}
						});
					}
				}
			});
		}
	});
}


exports.viewComments = function (postNo, page, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'view comments fail';
	callbackDatas.results = [];

	var viewCommentsSQL = "SELECT u.USERS_NICK AS userNick, u.USERS_IMG_PATH AS userImage, c.COMMENTS_NO AS commentNo, c.COMMENTS_CONTENTS AS commentsContents, DATE_FORMAT(c.COMMENTS_TIME, '%Y-%c-%d %H:%i:%s') AS commentsTime FROM COMMENTS AS c, USERS AS u WHERE c.POSTS_NO=? AND c.USERS_NO= u.USERS_NO ORDER BY commentsTime DESC"

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			callback(callbackDatas);
		} else {
			conn.query(viewCommentsSQL, postNo, function (vcErr, vcRows ) {
				if(vcErr) {
					console.error('vcErr = ', vcErr);
					conn.release();
					callback(callbackDatas);
				} else {
					var pageDatas = presetting.pageSetting(page, 10, vcRows);
					if(pageDatas.length == 0) {
						callbackDatas.success = 2;
						callbackDatas.message = "page over";
						callbackDatas.results = {"postNo" : postNo, "comments" : []};
						conn.release();
						callback(callbackDatas);
					} else {
						callbackDatas.success = 1;
						callbackDatas.message = "view comments success";
						callbackDatas.results = {
							"postNo" : postNo,
							"comments" : pageDatas
						};
						conn.release();
						callback(callbackDatas);
					}

				}
			});
		}
	});
}

//datas = [contents, userNo, postNo];
exports.comments = function (datas, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'comments fail';
	callbackDatas.results = [];

	var insertCommentsSQL = "INSERT INTO COMMENTS(COMMENTS_CONTENTS,COMMENTS_TIME,USERS_NO,POSTS_NO) VALUES(?, NOW(), ?, ?)";


	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			callbackDatas.success = 3;
			conn.release();
			callback(callbackDatas);
		} else {
			conn.query(insertCommentsSQL, datas, function (icErr, icRows) {
				if(icErr) {
					console.error('icErr = ', icErr);
					conn.release();
					callback(callbackDatas);
				} else {
					conn.query(presetting.lastInsertID(), function (liErr, liRow) {
						conn.query("SELECT u.USERS_NICK AS userNick, u.USERS_IMG_PATH AS userImage, c.COMMENTS_NO AS commentNo, c.COMMENTS_CONTENTS AS commentsContents, DATE_FORMAT(c.COMMENTS_TIME, '%Y-%c-%d %H:%i:%s') AS commentsTime FROM COMMENTS AS c, USERS AS u WHERE c.COMMENTS_NO=? AND c.USERS_NO= u.USERS_NO ",liRow[0].li, function (err, result) {
							if(err) {
								console.error('err = ', err);
								conn.release();
								callback(callbackDatas);
							} else {
								callbackDatas.message = "comments success"
								callbackDatas.success = 1;
								callbackDatas.results = result[0];
								conn.release();
								callback(callbackDatas);
							}
						})
					})
				}
			});
		}
	});
}

exports.purchaseList = function (postNo, callback ) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'purchase in post fail';
	callbackDatas.results = { "postimages" : [], "productList" : []};

	var postImagesSQL = "SELECT pimg.POSTS_IMG_PATH AS imagePath, pimg.POSTS_IMG_INFO AS imageInfo FROM POSTS_IMG pimg WHERE pimg.POSTS_NO=?"
	var productListSQL = "SELECT pr.PRODUCT_REP_IMG AS productImage, pr.PRODUCT_NO AS productNo, pr.PRODUCT_NM AS productNm, pr.PRODUCT_PRICE AS productPrice FROM PRODUCT AS pr, POSTS_PRODUCT AS pp, POSTS AS po WHERE pr.PRODUCT_NO=pp.PRODUCT_NO AND pp.POSTS_NO=po.POSTS_NO AND po.POSTS_NO=?"

	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			conn.release();
			callback(callbackDatas);
		} else {
			conn.query(postImagesSQL, postNo, function (piErr, piRows) {
				if(piErr) {
					console.error('piErr = ', piErr);
					conn.release();
					callback(callbackDatas);
				} else {
					conn.query(productListSQL, postNo, function (plErr, plRows) {
						if(plErr) {
							console.error('plErr = ', plErr);
							conn.release();
							callback(callbackDatas);
						} else {
							callbackDatas.success = 1;
							callbackDatas.message = "purchase in posts success";
							callbackDatas.results = {
								"postImages" : piRows,
								"productList" : plRows
							}
							conn.release();
							callback(callbackDatas);
						}
					});
				}
			});
		}
	});
}


//var datas = [userNo, tags, contents, images];
exports.Createpost = function (datas, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'create a post fail';
	callbackDatas.results = { "postNo" : 0 };
	var images = datas.pop();
	var postInsertSQL = 'INSERT INTO POSTS(POSTS_TIME, POSTS_REP_IMG, USERS_NO, POSTS_CONTENTS,POSTS_THUMBNAIL ) VALUES(NOW(), ?, ?, ?,?)';
	var tagSearchSQL = "SELECT * FROM TAGS WHERE TAGS_NM=?";
	var tagInsertSQL = 'INSERT INTO TAGS(TAGS_NM) VALUES(?)';
	var postsTagsInsertSQL = 'INSERT INTO POSTS_TAGS(TAGS_NO, POSTS_NO) VALUES(?,?)';
	var selectTagNoSQL = 'SELECT TAGS_NO FROM TAGS WHERE TAGS_NM=? ';
	var postsImgInsertSQL = 'INSERT INTO POSTS_IMG(POSTS_NO, POSTS_IMG_PATH) VALUES(?, ?)';
	//이 부분은 만약 썸네일로 사진 크기 줄일 경우 사용. 줄여보니 깨지는 것 같아서 원본 사진 사용.


	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			conn.release();
			callback(callbackDatas);
		} else {
			var thumbImage = images[0].destination+'postImages-Thumb/'+images[0].filename.substring(0,images[0].filename.length-4)+'-Thumb.jpg';
			imagemagick.resize( {
				srcPath: './'+images[0].path,
				dstPath: thumbImage,
				width: 200,
				height: 200
			}, function (imgErr, stdout, stderr) {
				if(imgErr) console.error('imgErr = ', imgErr);
				else {
					async.each(images, function (image, callback) {		//이미지들을 원하는 폴더로 이동.
						fs.move('./'+image.path, image.destination+'postImages/'+image.filename, function (err) {
							if(err) console.error('fs.move error = ', err);
							image.path= presetting.address()+'uploads/postImages/'+image.filename;
							callback();
						});
					}, function (err) {
						conn.query(postInsertSQL, [images[0].path, datas[0], datas[2],presetting.address()+thumbImage.substring(9)], function (piErr, piRows) {
		//				conn.query(postInsertSQL, [presetting.address()+thumbImage.substring(9), datas[0], datas[2]], function (piErr, piRows) {

									//먼저 게시물을 입력.
							if(piErr) {
								console.error('piErr = ', piErr);
								conn.release();
								callback(callbackDatas);
							} else {
								//게시물 번호를 찾는다.
								conn.query(presetting.lastInsertID(), function (liErr, liRow) {
									if(liErr) {
										console.error('liErr = ', liErr);
										conn.release();
										callback(callbackDatas);
									} else {
										var postNo = liRow[0].li;
										async.each(datas[1], function (tag, callback) {		//태그 입력 시작
											conn.query(tagInsertSQL, tag, function (tiErr, tiRows) {
												conn.query(selectTagNoSQL, tag, function (stErr, stRow) {
													if(stErr) {
														console.error('stErr = ', stErr);
														callback();
													} else {
														var tagNo = stRow[0].TAGS_NO;
														conn.query(postsTagsInsertSQL, [tagNo, postNo], function (itiErr, itiRow){
															if(itiErr) {
																console.error('itiErr = ', itiErr);
																callback();
															} else {
																//태그 입력 종료.
																callback();
															}
														});
													}
												});
											});
										}, function (err) {			//이미지 입력 시작
											async.each(images, function (image, callback) {
												conn.query(postsImgInsertSQL, [postNo, image.path], function (piiErr, piiRow) {
													if(piiErr) {
														console.error('piiErr = ', piiErr);
														callback();
													} else {
														callback();
													}
												});
											}, function (err) {
												conn.release();
												callbackDatas.success = 1;
												callbackDatas.message = "create a post success";
												callbackDatas.results = {"postNo" : postNo};
												callback(callbackDatas);
											});
										});
									}
								})
							}
						});
					});
				}
			});
		}
	});
}

exports.delPost = function ( postNo, userNo, callback) {
	var callbackDatas = {};
	callbackDatas.success = 3;
	callbackDatas.message = 'del post fail';

	var postSelectSQL = "SELECT * FROM POSTS WHERE USERS_NO=? AND POSTS_NO=?";
	var postUpdateDel = "UPDATE POSTS SET POSTS_DEL='Y' WHERE POSTS_NO=?"
	pool.getConnection ( function (connErr, conn) {
		if(connErr) {
			console.error('conErr = ', conErr );
			callbackDatas.message = "get Connection error";
			conn.release();
			callback(callbackDatas);
		} else {
			conn.query(postSelectSQL, [userNo, postNo], function (psErr, psRows) {
				if(psErr) {
					console.error('psErr = ', psErr);
					conn.release();
					callback(callbackDatas);
				} else if(psRows.length == 0){
					conn.release();
					callback(callabckDatas)
				} else {
					conn.query(postUpdateDel, postNo, function(puErr, puRows){
						if(puErr) {
							console.error('puErr = ', puErr);
							conn.release();
							callback(callbackDatas);
						} else {
							callbackDatas.success = 1;
							callbackDatas.message = 'del post success';
							conn.release();
							callback(callbackDatas);
						}
					});
				}
			});
		}
	});
}



































