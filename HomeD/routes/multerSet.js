var multer = require('multer');

var storage = multer.diskStorage({
	destination : function(req, file,cb) {	//경로
    cb(null, './public/uploads/')
  },
  filename : function (req, file, cb) {		//파일 이름
  	cb(null, file.fieldname+'-'+Date.now()+'.jpg');
  }
});

var upload = multer({
	storage : storage
});

exports.multerSet = function (){
	return upload;
}