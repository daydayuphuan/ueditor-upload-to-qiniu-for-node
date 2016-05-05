module.exports = function(app) {

    var RequestResult = require('../../service.util/util.result').RequestResult;
    var QiniuBiz = require('../biz/biz.qiniu');

    var urlPath = function(path) {
        return '/api/qiniu' + path;
    };

    //get: filelist
    app.get(urlPath(''), function(req, res, next) {
        var params = req.query;
        QiniuBiz.getFiles(params, function(err, data) {
            new RequestResult(req, res, err, data);
            return next();
        });
    });

    //post: upload
    app.post(urlPath(''), function(req, res, next) {
        var inputs = req.files;
        var body = req.body;

        QiniuBiz.upToFile(inputs, body, function(err, data) {
            new RequestResult(req, res, err, data);
            return next();
        });
    });

};