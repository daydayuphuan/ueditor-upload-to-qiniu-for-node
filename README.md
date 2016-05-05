# ueditor-upload-to-qiniu-for-node

## 1. 七牛配置项

在`service.qiniu` > `config` > `config.qiniu` 配置下面这些选项

```javascript
exports.qiniuConfig = {
    qiniuAccessKey: '',     //开发者密钥对应的 AccessKey
    qiniuSecretKey: '',     //开发者密钥对应的 SecretKey
    qiniuBucket: '',        //七牛存放图片的空间的名称
    qiniuBucketUrl: ''      //七牛图片显示对应的空间的URL前缀
}
```

## 2. 启动service.ueditor服务

```nodejs
node app.js
```

## 3. 服务接口
```javascript
// get
// http://localhost:3001/api/ueditor?action=<config | listimage | listfile>

// post
// http://localhost:3001/api/ueditor?action=<uploadimage | uploadfile | uploadVideo>
```

*接口支持JSONP格式，请求URL后面带上`callback`参数即可*

## 4. 接口返回结果集
```javascript
{
    status: <true | false>,     //接口请求状态，成功或失败
    code: 0,                    //接口请求状态码
    msg: '';                    //接口请求返回的消息
    data: null;                 //接口请求返回的数据
}
```

*所有接口采用统一的返回结果集*