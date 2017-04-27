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
   * @param {String} [options.agentId] - 消息默认 agentId
   *
   * @memberOf DingTalk
   */
  constructor(options = {}) {
    this.corpId = options.corpId;
    this.secret = options.secret;
    this.agentId = options.agentId;
    this.utils = utils;
    this.httpUtil = new HttpClient('oapi.dingtalk.com');
    this.cache = {};
  }

  request(method, path, query, body, key) {
    return this.getToken().then(() => {
      return this.httpUtil.request(method, path, query, body, key);
    });
  }

  get(api, query, key) {
    return this.request('GET', api, query, {}, key);
  }

  post(api, body, key) {
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
    const now = new Date();
    if (this.cache.access_token && this.cache.access_token_exp > now) {
      return Promise.resolve(this.cache.access_token);
    }
    return this.httpUtil.get('/gettoken', {
      corpid: this.corpId,
      corpsecret: this.secret,
    }, 'access_token')
      .then((ret) => {
        this.cache.access_token = ret;
        this.cache.access_token_exp = new Date(now.getTime() + 7200 * 1000);
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
    const now = new Date();
    if (this.cache.jsapi_ticket_exp > now) {
      return Promise.resolve({
        ticket: this.cache.jsapi_ticket,
        expires_in: parseInt((this.cache.jsapi_ticket_exp.getTime() - now.getTime()) / 1000, 10),
      });
    }
    return this.get('/get_jsapi_ticket', {
      type: 'jsapi',
    }, [ 'ticket', 'expires_in' ])
      .then((ret) => {
        this.cache.jsapi_ticket = ret.ticket;
        this.cache.jsapi_ticket_exp = new Date(now.getTime() + ret.expires_in * 1000);
        return Promise.resolve(ret);
      });
  }


  /**
   * 获取前端签名信息
   *
   * @param {String} url
   * @returns {Object} Sign
   *
   * @memberOf DingTalk
   */
  getSign(url) {
    return this.getTicket().then((data) => {
      return Promise.resolve(utils.getSign(data.ticket, url));
    });
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
    return this.post('/message/send', parmas, 'messageId');
  }

  /**
   * 发送文字消息
   *
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} content - 文字内容
   * @param {String} agentId - 发送者ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendText(toUsers, content, agentId = this.agentId) {
    const msg = utils.genMsgText(content);
    return this.sendMsg(agentId, toUsers, msg);
  }

  /**
   * 发送文件消息
   *
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} fileId - 文件资源ID
   * @param {String} agentId - 发送者ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendFile(toUsers, fileId, agentId = this.agentId) {
    const msg = utils.genMsgFile(fileId);
    return this.sendMsg(agentId, toUsers, msg);
  }

  /**
   * 发送图片消息
   *
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} imgId - 图片资源ID
   * @param {String} agentId - 发送者ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendImage(toUsers, imgId, agentId = this.agentId) {
    const msg = utils.genMsgImage(imgId);
    return this.sendMsg(agentId, toUsers, msg);
  }

  /**
   * 发送链接图文消息
   *
   * @param {String[]} toUsers - 接收用户ID列表
   * @param {String} url -点击链接地址
   * @param {String} title - 标题
   * @param {String} text - 内容
   * @param {String} imgId - 图片资源ID
   * @param {String} agentId - 发送者ID
   *
   * @return {String} messageId
   *
   * @memberOf DingTalk
   */
  sendLink(toUsers, url, title, text, imgId, agentId = this.agentId) {
    const msg = utils.genMsgLink(url, title, text, imgId);
    return this.sendMsg(agentId, toUsers, msg);
  }

}

module.exports = DingTalk;
