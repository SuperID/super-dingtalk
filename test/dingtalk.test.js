'use strict';

const config = require('./config');
const DingTalk = require('../lib').DingTalk;
const should = require('should');

const dingTalk = new DingTalk({
  corpId: config.corpId,
  secret: config.secret,
});

let ticketTime = 0;

describe('DingTalk', function () {

  it('get token', function (done) {
    dingTalk.getToken()
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('get ticket', function (done) {
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

  it('simpleList', function (done) {
    dingTalk.simpleList(config.department_id)
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('get ticket', function (done) {
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

  it('send message text', function (done) {
    dingTalk.sendText(config.agentId, config.toUsers, new Date().toString())
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('send message Link', function (done) {
    dingTalk.sendLink(config.agentId, config.toUsers, config.url, 'Hello Yourtion', new Date().toString(), config.img)
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

});
