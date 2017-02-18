'use strict';

const config = require('./config');
const should = require('should');


describe('DingTalk - Token', () => {

  const DingTalk = require('../lib').DingTalk;
  const dingTalk = new DingTalk({
    corpId: config.corpId,
    secret: config.secret,
  });
  let token;
  let ticketTime;
  
  it('获取Token', (done) => {
    dingTalk.getToken()
    .then(ret => {
      should.ok(ret);
      token = ret;
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('获取Ticket', (done) => {
    dingTalk.getTicket()
    .then(ret => {
      should.ok(ret);
      should.ok(ret.ticket);
      should.ok(ret.expires_in);
      ticketTime = ret.expires_in;
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('从缓存获取Token', (done) => {
    dingTalk.getToken()
    .then(ret => {
      should.ok(ret);
      ret.should.equal(token);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('从缓存获取Ticket', (done) => {
    dingTalk.getTicket()
    .then(ret => {
      should.ok(ret);
      should.ok(ret.ticket);
      should.ok(ret.expires_in);
      ret.expires_in.should.be.below(ticketTime);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

});

describe('DTOAuth - Token', () => {

  const DTOAuth = require('../lib').DTOAuth;
  const oauth = new DTOAuth({
    appId: config.oauth.appId,
    appSecret: config.oauth.appSecret,
  });
  let token;

  it('获取Token', (done) => {
    oauth.getToken()
    .then(ret => {
      should.ok(ret);
      token = ret;
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('从缓存获取Token', (done) => {
    oauth.getToken()
    .then(ret => {
      should.ok(ret);
      ret.should.equal(token);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

});
