'use strict';

const https = require('https');
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
    const opt = {
      method,
      headers: this.headers,
      host: this.host,
      path: path + '?' + querystring.stringify(this._merge(this.query, query)),
    };
    return new Promise((resolve, reject) => {
      const req = https.request(opt, (response) => {
        if (response.statusCode === 200) {
          const body = [];
          response.on('data', (data) => {
            body.push(data);
          }).on('end', () => {
            const result = JSON.parse(Buffer.concat(body).toString());
            if (result && result.errcode === 0) {
              return resolve(result);
            }
            reject(result);
          });
        } else {
          reject(response.statusCode);
        }
      });
      if(method !== 'GET') {
        req.write(body);
      }
      req.end();
    });
  }
}

module.exports = HTTPClient;
