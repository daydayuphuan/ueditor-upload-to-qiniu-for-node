module.exports = function (app) {

    var RequestResult = require('../../service.util/util.result').RequestResult;
    var UeditorBiz = require('../biz/biz.ueditor');

    var urlPath = function (path) {
        return '/api/ueditor' + (path || '');
    };

    // upload form
    var multer = require('multer');

    var uploadImage = multer().array(UeditorBiz.ueditorConfig.imageFieldName);

    var uploadScrawl = multer().array(UeditorBiz.ueditorConfig.scrawlFieldName);

    var uploadVideo = multer().array(UeditorBiz.ueditorConfig.videoFieldName);

    var uploadFile = multer().array(UeditorBiz.ueditorConfig.fileFieldName);


    // get：config | listimage | listfile
    app.get(urlPath(''), function (req, res, next) {
        var query = req.query;
        switch (query.action) {
            case UeditorBiz.actions.listImage:
                UeditorBiz.listImages(query, function (err, data) {
                    new RequestResult(req, res, err, data);
                    return next();
                });
                break;
            case UeditorBiz.actions.listFile:
                UeditorBiz.listFiles(function (err, data) {
                    new RequestResult(req, res, err, data);
                    return next();
                });
                break;
            default:
                UeditorBiz.getConfig(function (err, data) {
                    new RequestResult(req, res, err, data);
                    return next();
                });
                break;
        }
    });

    // post：uploadimage | uploadfile
    app.post(urlPath(''), function (req, res, next) {
        var action = req.query.action;

        if (!action) {
            new RequestResult(req, res, {
                msg: 'error request'
            });
            return next();
        }

        if (req.headers.accept.indexOf('text/html') >= 0) {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Vary', 'Accept-Encoding');
        }

        var checker = function (req, res, err) {
            if (err) {
                new RequestResult(req, res, err);
                return next();
            }
            if (!req.files && !req.files.length) {
                new RequestResult(req, res, {
                    msg: 'empty files'
                });
                return next();
            }
        }

        switch (action) {
            case UeditorBiz.actions.uploadImage:
                uploadImage(req, res, function (err) {
                    checker(req, res, err);
                    UeditorBiz.uploadImage(req.files[0], req.body, function (err, data) {
                        new RequestResult(req, res, err, data);
                        return next();
                    });
                });
                break;
            case UeditorBiz.actions.uploadScrawl:
                uploadScrawl(req, res, function (err) {
                    checker(req, res, err);
                    UeditorBiz.uploadScrawl(req.files[0], req.body, function (err, data) {
                        new RequestResult(req, res, err, data);
                        return next();
                    });
                });
                break;
            case UeditorBiz.actions.uploadVideo:
                uploadVideo(req, res, function (err) {
                    checker(req, res, err);
                    UeditorBiz.uploadVideo(req.files[0], req.body, function (err, data) {
                        new RequestResult(req, res, err, data);
                        return next();
                    });
                });
                break;
            case UeditorBiz.actions.uploadFile:
                uploadFile(req, res, function (err) {
                    checker(req, res, err);
                    UeditorBiz.uploadFile(req.files[0], req.body, function (err, data) {
                        new RequestResult(req, res, err, data);
                        return next();
                    });
                });
                break;
            default:
                new RequestResult(req, res, {
                    msg: 'error request'
                });
                return next();
        }
    });
};