'use strict';

const request = require('request');
const querystring = require('querystring');

class HTTPClient {

  constructor(host) {
    this.host = host;
    this.query = {};
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  _merge(...args) {
    const ret = {};
    for (const item of args) {
      for(const i in item) {
        ret[i] = item[i];
      }
    }
    return ret;
  }

  /**
   * 发送请求
   *
   * @param {String} method - 请求方法（GET、POST）
   * @param {String} path - API地址
   * @param {Object} query - 请求 query 参数
   * @param {Object} body - 请求 body 参数
   *
   * @return {Promise}
   */
  _request(method, path, query, body) {
    const url = 'https://' + this.host + path + '?' + querystring.stringify(this._merge(this.query, query));
    const opt = {
      method,
      url,
      headers: this.headers,
      json: true,
    };
    if(method === 'POST') opt.json = body;
    return new Promise((resolve, reject) => {
      request(opt, (error, response, result) => {
        if (!error && response.statusCode === 200) {
          if (result && result.errcode === 0) {
            return resolve(result);
          }
          reject(result);
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * 通用请求接口
   * 
   * @param {String} method - GET、POST
   * @param {String} api - API地址（以 / 开头）
   * @param {Object} query - 请求URL参数（获取AccessToken后默认会带上）
   * @param {String} body - POST请求的body（JSON需要JSON.stringify）
   * @param {String} key - 返回数据中取出需要的key（不传全部ret返回）
   * @returns Promise
   */
  request(method, api, query, body, key) {
    return this._request(method, api, query, body).then(ret => {
      if (ret && ret.errcode === 0) {
        const res = key ? ret[key] || '' : ret;
        return Promise.resolve(res);
      }
      return Promise.reject(ret);
    });
  }

  get(api, query, key) {
    return this.request('GET', api, query, {}, key);
  }

  post(api, body, key) {
    return this.request('POST', api, {}, body, key);
  }
}

module.exports = HTTPClient;
