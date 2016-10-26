var express = require('express');
var router = express.Router();
var multer = require('../multerSet');
var upload = multer.multerSet();
var db = require('../../models/homepage/db_main');

router.get('/', upload.array(), function (req, res, next) {
	res.redirect('/main');
});

router.get('/main', upload.array(), function (req, res, next) {
	db.homed_story(function (results) {
		res.render('homepage_v2/v2_main', {"results": results.results });
	});
});
router.get('/designerList', upload.array(), function (req, res, next) {
	db.designerList(function (results) {
		res.json(results);
	});
});
// router.get('/homed-story',  upload.array(), function (req, res, next) {
// 	res.redirect('/homed-story/2')
// });
router.get('/homed-story', upload.array(), function (req, res, next) {
	var storyNo = req.params.storyNo;
	db.homed_story(function(results) {
		var portpolioDatas = results.results;
		var storyText = portpolioDatas[0].homedStoryInfo;
		for(var i = 0; i < portpolioDatas.length; i++) {
			if(portpolioDatas[i].homedStoryNo == storyNo){
				storyText =portpolioDatas[i].homedStoryInfo;
				break;
			}
		}
		db.homed_storyList (storyNo, function (storyInfo){
			res.render('homepage/homed_story/homed_story_main', {
				"results": portpolioDatas, "storyInfo" : storyInfo.results, "storyText" : storyText
			});
		});
	});
});

router.get('/homed-story-info/:storyNo', upload.array(),function (req, res, next) {
	db.homed_storyList(req.params.storyNo, function (results) {
		res.json(results);
	});
})
router.get('/intro', upload.array(),function (req, res, next) {
	res.render('homepage/homed_intro');
})

// ------------------------------------------------------------------

router.get('/portpolio', upload.array(),function (req, res, next) {
	db.homed_story_2(function (results) {
		res.render('homepage_v2/v2_portpolio_list', {
			"storyList" : results.results
		});
	});
});
router.get('/portpolio/:portpolioNo', upload.array(),function (req, res, next) {

	var portpolioNo = req.params.portpolioNo;
	db.homed_story_2_post(portpolioNo,function (results) {
		res.render('homepage_v2/v2_portpolio', {
			"result" : results.results,
			"imgList" : results.imgList
		});
	});
});
module.exports = router;
