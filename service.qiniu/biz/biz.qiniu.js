var fs = require('fs');
var qiniu = require('qiniu');
var moment = require('moment');

var qiniuConfig = require('../config/config.qiniu').qiniuConfig;
var RequestResult = require('../../service.util/util.result').RequestResult;

qiniu.conf.ACCESS_KEY = qiniuConfig.qiniuAccessKey;
qiniu.conf.SECRET_KEY = qiniuConfig.qiniuSecretKey;

exports.getFiles = getFiles;
exports.upToFile = upToFile;

//文件列表
function getFiles(params, callback) {

    var prefix = params.prefix;
    var start = params.start || 0;
    var limit = params.limit || 10;


    qiniu.rsf.listPrefix(qiniuConfig.qiniuBucket, prefix, null, limit, function (err, data) {
        if (!err) {
            var getlist = function () {
                var list = [];
                for (var i = start, j = start + limit; i < j; i++) {
                    var item = data.items[i];
                    if (!item) {
                        break;
                    }
                    list.push({
                        'url': qiniuConfig.qiniuBucketUrl + item.key,
                        'fsize': item.fsize,
                        'create_time': moment.unix(item.putTime / 1e7).format('YYYY-MM-DD HH:mm:ss')//:SSS 毫秒
                    });
                }
                return list;
            }
            return callback(null, getlist());
        } else {
            return callback(err);
        }
    });
}

//文件上传
function upToFile(file, body, callback) {

    var callback_url = body['callback_url'];

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    var upToken = function (callback_url) {
        var putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.qiniuBucket + ':' + file.originalname);
        if (callback_url) {
            putPolicy.callbackUrl = callback_url;
            putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
        }
        return putPolicy.token();
    };

    //构造上传函数
    var uploadFile = function (upToken) {
        var extra = new qiniu.io.PutExtra();
        if (!file.path) {
            qiniu.io.put(upToken, file.originalname, file.buffer, extra, function (err, data) {
                uploadResult(err, data);
            });
        } else {
            qiniu.io.putFile(upToken, file.originalname, file.path, extra, function (err, data) {
                uploadResult(err, data);
            });
        }
    };

    var uploadResult = function (err, data) {
        if (!err) {
            var uploader_res = {
                url: qiniuConfig.qiniuBucketUrl + data.key,
                title: file.originalname,
                original: file.originalname,
                state: 'SUCCESS'
            };
            return callback(null, uploader_res);
        } else {
            return callback(err);
        }
    };

    //调用uploadFile上传
    uploadFile(upToken(callback_url));
}

//抓取远程图片
function fetchImage(body, callback) {
    var url = body['url'];
    qiniu.rs.client.fetch(url, qiniuConfig.qiniuBucket, key, function (err, data) {
        callback(err, data);
    });
}