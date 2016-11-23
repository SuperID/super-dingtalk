'use strict';

const HttpClient = require('./http');
const utils = require('./utils');

class DingTalk {

  constructor(options = {}) {
    this.corpId = options.corpId;
    this.secret = options.secret;
    this.httpUtil = new HttpClient('oapi.dingtalk.com');
  }

  _request(method, api, query, body, key) {
    return this.httpUtil.request(method, api, query, body).then(ret => {
      if(ret && ret.errcode === 0) {
        const res = key ? ret[key] || '' : ret;
        return Promise.resolve(res);
      }
      return Promise.reject(ret);
    });
  }

  _get(api, query, key) {
    return this._request('GET', api, query, {}, key);
  }

  _post(api, body, key) {
    return this._request('POST', api, {}, body, key);
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

  sendText(agentId, toUsers, content) {
    if(!agentId || !toUsers || !content) throw new Error('misssing userId, toUser');
    const users = Array.isArray(toUsers) ? toUsers.join('|') : toUsers;
    const parmas = {
      agentid: agentId,
      touser: users,
    };
    Object.assign(parmas, utils.genMsgText(content));
    return this._post('/message/send', parmas, 'messageId');
  }

  sendLink(agentId, toUsers, url, title, text, img) {
    if(!agentId || !toUsers) throw new Error('misssing userId, toUser');
    const users = Array.isArray(toUsers) ? toUsers.join('|') : toUsers;
    const parmas = {
      agentid: agentId,
      touser: users,
    };
    Object.assign(parmas, utils.genMsgLink(url, title, text, img));
    return this._post('/message/send', parmas, 'messageId');
  }

}

module.exports = DingTalk;
