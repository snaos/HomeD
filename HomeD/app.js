var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');
var sessionStore = require('express-mysql-session');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//------------------앱 사용 부분---------
var routes = require('./routes/app/index');
var user = require('./routes/app/user');
var post = require('./routes/app/post');
var myPage = require('./routes/app/myPage');
var search = require('./routes/app/search');
var interior = require('./routes/app/interior');
var product = require('./routes/app/product');
var admin = require('./routes/app/admin');
var shop = require('./routes/app/shop');
//-------------------관리자 페이지 접근-----------------------------
var manager = require('./routes/manager/shop');
// -------------------웹페이지 사용 부분-----------------------------
var doInterior = require('./routes/homepage/doInterior');
var homepage = require('./routes/homepage/index');
var question = require('./routes/homepage/question');
var policy = require('./routes/homepage/policy');
// -------------------웹페이지 v2 부분 -------------------------------



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var multer = require('multer');

var storage = multer.diskStorage({
  destination : function(req, file,cb) {  //경로
    cb(null, './public/uploads/')
  },
  filename : function (req, file, cb) {   //파일 이름
    cb(null, file.fieldname+'-'+Date.now()+'.jpg');
  }
});
var upload = multer({
  storage : storage
});


var sessionOptions = {
    host : 'homed.co.kr',
    port : 3306,
    user: 'root',
    password: 'homed0314',
    database: 'mydb',
    useConnectionPooling : true
};

app.use(session({
    store : new sessionStore(sessionOptions),
    secret: 'cats',
    resave: true,
    saveUninitialized: true
}))

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use('/v1/', routes);
app.use('/v1/user', user);
app.use('/v1/post', post);
app.use('/v1/myPage', myPage);
app.use('/v1/search', search);
app.use('/v1/interior', interior);
app.use('/v1/product', product);
app.use('/v1/admin', admin);
app.use('/v1/shop', shop);
//-----------------------------------
app.use('/v1/web', manager);
// ---------------------------------------
app.use('/', homepage);
app.use('/question', question);
app.use('/doInterior', doInterior);
app.use('/policy', policy);
// ----------------------------------------


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var httpsOptions = {
    key: fs.readFileSync('./key.pem', 'utf8'),
    cert: fs.readFileSync('./server.crt', 'utf8')
}

var port80 = 80;
var port443 = 443;


http.createServer(app).listen(port80, function() {
    console.log('HTTP server listening on port'+ port80);
});

https.createServer(httpsOptions, app).listen(port443, function() {
    console.log('HTTPS server listening on port'+ port443);
});

module.exports = app;
