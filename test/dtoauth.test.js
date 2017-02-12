'use strict';

const config = require('./config');
const DTOAuth = require('../lib').DTOAuth;
const should = require('should');

const oauth = new DTOAuth({
  appId: config.oauth.appId,
  appSecret: config.oauth.appSecret,
});

const tempCode = '41050af417113b25a183b90a1da7e330';
let openId;
let persistentCode;
let snsToken;

describe('DTOAuth', function () {
  it('get token', function (done) {
    oauth.getToken()
      .then(ret => {
        should.ok(ret);
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('get PersistentCode', function (done) {
    oauth.getPersistentCode(tempCode)
      .then(ret => {
        should.ok(ret);
        should.ok(ret.openid);
        should.ok(ret.persistent_code);
        should.ok(ret.unionid);
        openId = ret.openid;
        persistentCode = ret.persistent_code;
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('get SnsToken', function (done) {
    oauth.getSnsToken(openId, persistentCode)
      .then(ret => {
        should.ok(ret);
        should.ok(ret.sns_token);
        should.ok(ret.expires_in);
        snsToken = ret.sns_token;
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('get UserInfo', function (done) {
    oauth.getUserInfo(snsToken)
      .then(ret => {
        should.ok(ret);
        should.ok(ret.user_info);
        console.log(ret);
        done();
      })
      .catch(err => {
        done(err);
      });
  });

});
