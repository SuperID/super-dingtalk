'use strict';

const crypto = require('crypto');

const utils = {
  getJsapiSign(ticket, nonceStr, timeStamp, url) {
    const plain = `jsapi_ticket=${ ticket }&noncestr=${ nonceStr }&timestamp=${ timeStamp }&url=${ url }`;
    const sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    return sha1.digest('hex');
  },

  getSign(jsapiTicket, url) {
    const data = {};
    data.ticket = jsapiTicket;
    data.timeStamp = new Date().getTime();
    data.nonceStr = 'sss';
    data.url = url;
    data.signature = utils.getJsapiSign(data.ticket, data.nonceStr, data.timeStamp, data.url);
    return data;
  },

  genMsgText(content) {
    return {
      msgtype: 'text',
      'text': { content },
    };
  },

  genMsgImage(media_id) {
    return {
      'msgtype': 'image',
      'image': { media_id },
    };
  },

  genMsgVoice(media_id, duration) {
    return {
      'msgtype': 'voice',
      'voice': { media_id, duration },
    };
  },

  genMsgFile(media_id) {
    return {
      'msgtype': 'file',
      'voice': { media_id },
    };
  },

  genMsgLink(url, title, text, img) {
    return {
      'msgtype': 'link',
      'link': {
        'messageUrl': url,
        'picUrl': img,
        title,
        text,
      },
    };
  },
  
};

module.exports = utils;
