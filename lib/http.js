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

  /*
   * 发送请求
   *
   * @param {String} method
   * @param {String} path
   * @param {Object} parma
   * @returns
   */
  request(method, path, parma) {
    const opt = {
      method,
      headers: this.headers,
      host: this.host,
    };
    if(method === 'GET') {
      opt.path = path + '?' + querystring.stringify(Object.assign(this.query, parma));
    } else {
      opt.path = path + '?' + querystring.stringify(this.query);
    }
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
        req.write(JSON.stringify(parma) + '\n');
      }
      req.end();
    });
  }
}

module.exports = HTTPClient;
