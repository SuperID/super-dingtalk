'use strict';

const config = require('./config');
const DTOAuth = require('../lib').DTOAuth;
const should = require('should');

const oauth = new DTOAuth({
  appId: config.oauth.appId,
  appSecret: config.oauth.appSecret,
});

const tempCode = '';
let openId;
let persistentCode;
let snsToken;

describe('DTOAuth', function () {

  it('get QRParmasUrl', (done) => {
    const url = oauth.getQRParmasUrl('http://blog.yourtion.com');
    should.ok(url);
    done();
  });

  it('get PersistentCode', (done) => {
    if(!tempCode) return done();
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

  it('get SnsToken', (done) => {
    if(!tempCode) return done();
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

  it('get UserInfo', (done) => {
    if(!tempCode) return done();
    oauth.getUserInfo(snsToken)
      .then(ret => {
        should.ok(ret);
        should.ok(ret.user_info);
        done();
      })
      .catch(err => {
        done(err);
      });
  });

});
