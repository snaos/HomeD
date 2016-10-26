var express = require('express');
var router = express.Router();
var multer = require('../multerSet');
var upload = multer.multerSet();


router.get('/Terms', upload.array(), function (req, res, next) {
	res.render('homepage_v2/TermsOfUse/terms');
});

router.get('/Disclaimer', upload.array(), function (req, res, next) {
	res.render('homepage_v2/TermsOfUse/Disclaimer');
});
router.get('/Privacy', upload.array(), function (req, res, next) {
	res.render('homepage_v2/TermsOfUse/Privacy');
});



module.exports = router;
