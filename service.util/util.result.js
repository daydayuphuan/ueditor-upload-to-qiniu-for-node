//请求返回结果对象
function RequestResult(req, res, err, data) {
    var sendResult = null;
    if (data && data.noWarp) {
        sendResult = data;
    } else {
        if (err) {
            sendResult = this.fail(err);
        } else {
            sendResult = this.success({ data: data });
        }
    }

    var cb = req.query && req.query.callback;
    if (cb) {
        var jsonp_data = cb + '(' + JSON.stringify(sendResult) + ')';
        res.send(jsonp_data);
    } else {
        res.send(sendResult);
    }
}

RequestResult.prototype.success = function (data) {
    this.status = true;
    this.code = data.code || 0;
    this.msg = data.msg || '';
    this.data = data.data || null;
    return this;
}

RequestResult.prototype.fail = function (err) {
    this.status = false;
    this.code = err.code || 0;
    this.msg = err.error || err.msg || err;
    this.data = err.data || null;
    return this;
}

exports.RequestResult = RequestResult;