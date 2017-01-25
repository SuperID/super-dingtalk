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
  request(method, path, query, body) {
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
}

module.exports = HTTPClient;
