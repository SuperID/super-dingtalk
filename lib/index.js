'use strict';

const HttpClient = require('./http');
const utils = require('./utils');

class DingTalk {

  constructor(options = {}) {
    this.corpId = options.corpId;
    this.secret = options.secret;
    this.utils = utils;
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
    return this._request('GET', api, query, JSON.stringify({}), key);
  }

  _post(api, body, key) {
    return this._request('POST', api, {}, JSON.stringify(body), key);
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

  sendMsg(agentId, toUsers, msg) {
    if(!agentId || !toUsers || !msg) throw new Error('misssing userId, toUser, msg');
    const users = Array.isArray(toUsers) ? toUsers.join('|') : toUsers;
    const parmas = {
      agentid: agentId,
      touser: users,
    };
    Object.assign(parmas, msg);
    return this._post('/message/send', parmas, 'messageId');
  }

  sendText(agentId, toUsers, content) {
    const msg = utils.genMsgText(content);
    return this.sendMsg(agentId, toUsers, msg);
  }

  sendFile(agentId, toUsers, fileId) {
    const msg = utils.genMsgFile(fileId);
    return this.sendMsg(agentId, toUsers, msg);
  }

  sendImage(agentId, toUsers, imgId) {
    const msg = utils.genMsgImage(imgId);
    return this.sendMsg(agentId, toUsers, msg);
  }

  sendLink(agentId, toUsers, url, title, text, imgId) {
    const msg = utils.genMsgLink(url, title, text, imgId);
    return this.sendMsg(agentId, toUsers, msg);
  }

}

module.exports = DingTalk;
