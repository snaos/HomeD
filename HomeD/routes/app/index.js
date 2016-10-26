var express = require('express');
var router = express.Router();
var multer = require('../multerSet');
var upload = multer.multerSet();
/* GET home page. */
router.get('/', upload.array(), function (req, res, next) {
	res.redirect('http://www.pagebrick.com/HOMED/homed/');
});

router.get('/version', upload.array(), function (req, res, next) {
	res.json({
		"version" : '1.0'
	});
});

router.get('/termsOfUse', upload.array(), function (req,res) {
	res.render('TermsOfUse/TermsOfUse', {title : '이용 약관'});
});

router.get('/disclaimer', upload.array(), function (req,res) {
	res.render('TermsOfUse/Disclaimer', {title : '면책 사항'});
});
router.get('/privacyPolicy', upload.array(), function (req,res) {
	res.render('TermsOfUse/PrivacyPolicyTerms', {title : '개인정보 이용방침'});
});


module.exports = router;
