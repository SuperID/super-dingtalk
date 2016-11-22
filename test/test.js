'use strict';

const config = require('./config');
const DingTalk = require('../lib');

const dingTalk = new DingTalk({
  corpId: config.corpId,
  secret: config.secret,
});

describe('DingTalk', function () {

  it('access token', function (done) {
    dingTalk.getToken()
    .then(ret => {
        console.log('success', ret);
        done();
    })
    .catch(err => {
        console.log('error', err);
        done(err);
    });
  });

});
