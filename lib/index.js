'use strict';

const HttpClient = require('./http');

class DingTalk {

  constructor(options = {}) {
    this.corpId = options.corpId;
    this.secret = options.secret;
    this.httpUtil = new HttpClient('oapi.dingtalk.com');
  }

  _request(method, path, query, body, key) {
    return this.httpUtil.request(method, path, query, body).then(ret => {
      if(ret && ret.errcode === 0) {
        const res = key ? ret[key] || '' : ret;
        return Promise.resolve(res);
      }
      return Promise.reject(ret);
    });
  }

  _get(path, query, key) {
    return this._request('GET', path, query, {}, key);
  }

  _post(path, body, key) {
    return this._request('POST', path, {}, body, key);
  }

  getToken() {
    return this._get('/gettoken', {
      corpid: this.corpId,
      corpsecret: this.secret,
    }, 'access_token')
    .then((ret) => {
      this.httpUtil.query.access_token = ret;
      return Promise.resolve(ret);
    });
  }

  getTicket() {
    return this._get('/get_jsapi_ticket', { type: 'jsapi' }, 'ticket');
  }

  simpleList(department_id) {
    if(!department_id) throw new Error('misssing department_id');
    return this._get('/user/simplelist', { department_id }, 'userlist');
  }

}

module.exports = DingTalk;
