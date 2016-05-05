var express = require('express');
var logger = require('morgan');
var http = require('http');
//var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

// logger
app.use(logger('dev'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(__dirname + '/log/access.log', {flags: 'a'});
// setup the logger
// app.use(morgan('huange', {stream: accessLogStream}));


// set the cross-domain access
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://192.168.3.102');
    res.header('Access-Control-Allow-Headers', 'Accept,Content-Length,Authorization,X_Requested_With,Content-Type,Cookie');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('CacheControl', 'no-cache');
    res.header('X-Powered-By','huange');
    //res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// test
app.get('/', function(req, res) {
    res.send('Hello Huange! UEditor Service');
});

// ueditor api
require('./api/api.ueditor')(app);


// listen port
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at http://%s:%s', host, port);
});