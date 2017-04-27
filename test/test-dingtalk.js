'use strict';

const config = require('./config');
const DingTalk = require('../lib').DingTalk;
const should = require('should');

const dingTalk = new DingTalk({
  corpId: config.corpId,
  secret: config.secret,
  agentId: config.agentId,
});

let unionid;

describe('DingTalk', function () {

  it('获取前端签名', (done) => {
    dingTalk.getSign()
    .then(ret => {
      should.ok(ret);
      should.ok(ret.timeStamp);
      should.ok(ret.nonceStr);
      should.ok(ret.ticket);
      should.ok(ret.signature);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('simpleList', (done) => {
    const pamras = {
      department_id: config.department_id,
    };
    dingTalk.get('/user/simplelist', pamras, 'userlist')
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('获取成员详情 - /user/get', (done) => {
    const pamras = {
      userid: config.user_id,
    };
    dingTalk.get('/user/get', pamras)
    .then(ret => {
      should.ok(ret);
      unionid = ret.unionid;
      ret.userid.should.equal(config.user_id);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('根据unionid获取成员的userid - /user/getUseridByUnionid', (done) => {
    const pamras = {
      unionid,
    };
    dingTalk.get('/user/getUseridByUnionid', pamras, 'userid')
    .then(ret => {
      should.ok(ret);
      ret.should.equal(config.user_id);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('发送文字消息', (done) => {
    dingTalk.sendText(config.toUsers, new Date().toString())
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

  it('发送链接消息', (done) => {
    dingTalk.sendLink(config.toUsers, config.url, 'Hello Yourtion', new Date().toString(), config.img)
    .then(ret => {
      should.ok(ret);
      done();
    })
    .catch(err => {
      done(err);
    });
  });

});
