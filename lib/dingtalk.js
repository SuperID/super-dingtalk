'use strict';

/**
 * DingTalk client for Node.js 钉钉 Node.js 客户端
 *
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const HttpClient = require('./http');
const utils = require('./utils');

class DingTalk {

  /**
   * Creates an instance of DingTalk.
   *
   * @param {Object} [options={}]
   * @param {String} [options.corpId] - 钉钉 CorpId
   * @param {String} [options.secret] - 钉钉 Secret
   * @param {String} [options.accessToken] - 已经获取的 AccessToken
   *
   * @memberOf DingTalk
   */
  constructor(options = {}) {
    this.corpId = options.corpId;
    this.secret = options.secret;
    this.utils = utils;
    this.httpUtil = new HttpClient('oapi.dingtalk.com');
    if (options.accessToken) {
      this.httpUtil.query.access_token = options.accessToken;
    }
  }

  /**
   * 通用请求接口
   * 
   * @param {String} method - GET、POST
   * @param {String} api - API地址（以 / 开头）
   * @param {Object} query - 请求URL参数（获取AccessToken后默认会带上）
   * @param {String} body - POST请求的body（JSON需要JSON.stringify）
   * @param {String} key - 返回数据中取出需要的key（不传全部ret返回）
   * @returns
   * 
   * @memberOf DingTalk
   */
  request(method, api, query, body, key) {
    return this.httpUtil.request(method, api, query, body).then(ret => {
      if (ret && ret.errcode === 0) {
        const res = key ? ret[key] || '' : ret;
        return Promise.resolve(res);
      }
      return Promise.reject(ret);
    });
  }

  _get(api, query, key) {
    return this.request('GET', api, query, {}, key);
  }

  _post(api, body, key) {
    return this.request('POST', api, {}, body, key);
  }

  /**
   * 获取 AccessToken
   * （获取会自动保存到 client 实例中）
   *
   * @return {String} AccessToken
   *
   * @memberOf DingTalk
   */
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

  /**
   * 获取 Ticket
   *
   * @return {String} Ticket
   *
   * @memberOf DingTalk
   */
  getTicket() {
    return this._get('/get_jsapi_ticket', { type: 'jsapi' }, 'ticket');
  }

  /**
   * 获取部门成员列表
   *
   * @param {String} department_id - 部门ID
   *
   * @return {Object[]} 成员列表
   *
   * @memberOf DingTalk
   */
  simpleList(department_id) {
    if (!department_id) throw new Error('misssing department_id');
    return this._get('/user/simplelist', { department_id }, 'userlist');
  }

  /**
   * 发送消息
   *
   * @param {String} agentId - 发送者ID
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {Object} msg - 消息对象
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendMsg(agentId, toUsers, msg) {
    if (!agentId || !toUsers || !msg) throw new Error('misssing userId, toUser, msg');
    const users = Array.isArray(toUsers) ? toUsers.join('|') : toUsers;
    const parmas = {
      agentid: agentId,
      touser: users,
    };
    Object.assign(parmas, msg);
    return this._post('/message/send', parmas, 'messageId');
  }

  /**
   * 发送文字消息
   *
   * @param {String} agentId - 发送者ID
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} content - 文字内容
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendText(agentId, toUsers, content) {
    const msg = utils.genMsgText(content);
    return this.sendMsg(agentId, toUsers, msg);
  }

  /**
   * 发送文件消息
   *
   * @param {String} agentId - 发送者ID
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} fileId - 文件资源ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendFile(agentId, toUsers, fileId) {
    const msg = utils.genMsgFile(fileId);
    return this.sendMsg(agentId, toUsers, msg);
  }

  /**
   * 发送图片消息
   *
   * @param {String} agentId - 发送者ID
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} imgId - 图片资源ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendImage(agentId, toUsers, imgId) {
    const msg = utils.genMsgImage(imgId);
    return this.sendMsg(agentId, toUsers, msg);
  }

  /**
   * 发送链接图文消息
   *
   * @param {String} agentId - 发送者ID
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} url -点击链接地址
   * @param {String} title - 标题
   * @param {String} text - 内容
   * @param {String} imgId - 图片资源ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendLink(agentId, toUsers, url, title, text, imgId) {
    const msg = utils.genMsgLink(url, title, text, imgId);
    return this.sendMsg(agentId, toUsers, msg);
  }

}

module.exports = DingTalk;