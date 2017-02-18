'use strict';

/**
 * DingTalk OAuth client for Node.js 钉钉OAuth Node.js 客户端
 *
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const HttpClient = require('./http');

class DTOAuth {
  /**
   * Creates an instance of DingTalk.
   *
   * @param {Object} [options={}]
   * @param {String} [options.appId] - 钉钉第三方登录 AppId
   * @param {String} [options.appSecret] - 钉钉第三方登录 AppSecret
   *
   * @memberOf DingTalk
   */
  constructor(options = {}) {
    this.appId = options.appId;
    this.appSecret = options.appSecret;
    this.httpUtil = new HttpClient('oapi.dingtalk.com');
    this.cache = {};
  }

  /**
   * 获取 AccessToken
   * （获取会自动保存到 client 实例中）
   *
   * @return {Promise<String>} AccessToken
   *
   * @memberOf DingTalk
   */
  getToken() {
    const now = new Date();
    if(this.cache.access_token && this.cache.access_token_exp > now) {
      return Promise.resolve(this.cache.access_token);
    }
    return this.httpUtil.get('/sns/gettoken', {
      appid: this.appId,
      appsecret: this.appSecret,
    }, 'access_token')
      .then((ret) => {
        this.httpUtil.query.access_token = ret;
        this.cache.access_token = ret;
        this.cache.access_token_exp = new Date(now.getTime() + 7200 * 1000);
        return Promise.resolve(ret);
      });
  }

  /**
   * 获取用户授权的持久授权码
   *
   * @param {String} tmpAuthCode - 临时授权码
   * @returns {Promise<Object>} result
   * @returns {String} result.openid - 开放应用内的唯一标识
   * @returns {String} result.persistent_code - 开放应用授权的持久授权码
   * @returns {String} result.unionid - 当前钉钉开放平台账号范围内的唯一标识
   *
   * @memberOf DTOAuth
   */
  getPersistentCode(tmpAuthCode) {
    return this.httpUtil.post('/sns/get_persistent_code', {
      tmp_auth_code: tmpAuthCode,
    }, [ 'openid', 'persistent_code', 'unionid' ]);
  }


  /**
   * 获取用户授权的SNS_TOKEN
   *
   * @param {String} openId - 用户的openid
   * @param {String} persistentCode - 应用的持久授权码
   * @returns {Promise<Object>} result
   * @returns {String} result.sns_token - 用户授权的token
   * @returns {Number} result.expires_in - sns_token的过期时间
   *
   * @memberOf DTOAuth
   */
  getSnsToken(openId, persistentCode) {
    return this.httpUtil.post('/sns/get_sns_token', {
      openid: openId,
      persistent_code: persistentCode,
    }, [ 'sns_token', 'expires_in' ]);
  }

  /**
   * 用户授权的个人信息
   *
   * @param {String} snsToken
   * @returns {Promise<Object>} result
   * @returns {Object} result.user_info - 用户信息
   * @returns {Object} result.corp_info - 企业信息（默认不返回）
   *
   * @memberOf DTOAuth
   */
  getUserInfo(snsToken) {
    return this.httpUtil.get('/sns/getuserinfo', {
      sns_token: snsToken,
    }, [ 'user_info', 'corp_info' ]);
  }

  /**
   * 获取二维码参数url
   *
   * @param {String} redirectUri - 重定向URL
   * @returns {String} DDLogin parmas url
   *
   * @memberOf DTOAuth
   */
  getQRParmasUrl(redirectUri) {
    const url = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize' +
                `?appid=${ this.appId }&response_type=code&scope=snsapi_login` +
                `&redirect_uri=${ redirectUri }`;
    return encodeURIComponent(url);
  }
}

module.exports = DTOAuth;
