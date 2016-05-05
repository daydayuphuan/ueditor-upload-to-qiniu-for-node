var options = require('../config/config.ueditor').ueditorOptions;
var qiniuBiz = require('../../service.qiniu/biz/biz.qiniu');
var ueditorConfig = options.configs;

exports.actions = options.actions;
exports.ueditorConfig = ueditorConfig;
exports.getConfig = getConfig;
exports.uploadImage = uploadImage;
exports.uploadFile = uploadFile;
exports.uploadVideo = uploadVideo;
exports.uploadScrawl = uploadScrawl;
exports.catchImage = catchImage;
exports.listImages = listImages;
exports.listFiles = listFiles;


//获取上传配置
function getConfig(callback) {
    return callback(null, ueditorConfig);
}

//列出所有图片
function listImages(params, callback) {
    var param = {
        prefix: ueditorConfig.imageUrlPrefix,
        start: params.start,
        limit: params.size
    };
    qiniuBiz.getFiles(param, callback);
}

//列出所有的文件
function listFiles(params, callback) {
    var param = {
        prefix: ueditorConfig.fileUrlPrefix,
        start: params.start,
        limit: params.limit
    };
    qiniuBiz.getFiles(param, callback);
}

//上传图片
function uploadImage(file, body, callback) {

    checkUploadAndRename(file, ueditorConfig.uploadConfig.image);

    qiniuBiz.upToFile(file, body, callback);
}

//上传文件
function uploadFile(file, body, callback) {
    checkUploadAndRename(file, ueditorConfig.uploadConfig.image);
    
    qiniuBiz.upToFile(file, body, callback);
}

//上传视频
function uploadVideo(file, body, callback) {
    checkUploadAndRename(file, ueditorConfig.uploadConfig.image);

    qiniuBiz.upToFile(file, body, callback);
}

//涂鸦上传
function uploadScrawl(file, body, callback) {
    checkUploadAndRename(file, ueditorConfig.uploadConfig.image);

    qiniuBiz.upToFile(file, body, callback);
}

//抓取远程图片
function catchImage(body, callback) {
    qiniuBiz.fetchImage(body, callback);
}


//验证上传文件（格式，大小）
function checkUploadAndRename(file, config) {

    //文件类型
    if (config.allowType.indexOf(file.mimetype) >= 0) {
        return {
            code: 10001,
            msg: '上传类型错误'
        };
    }

    //文件大小
    if (file.size > config.size) {
        return {
            code: 10002,
            msg: '文件大小超过最大上传限制'
        };
    }

    file.originalname = config.fileKey + '_' + file.originalname;
}