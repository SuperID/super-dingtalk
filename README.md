# super-dingtalk

DingTalk client for Node.js 钉钉 Node.js 客户端

## 安装

```bash
$ npm install super-dingtalk --save
```

## 使用方法

### 应用方法说明

**各个方法需要的 Token 在接口请求（`request`、`get`、`post`）自动获取和续期，也可以通过  `getToken()` 获得**

```javascript
/**
  * 通用请求接口
  *
  * @param {String} method - GET、POST
  * @param {String} api - API地址（以 / 开头）
  * @param {Object} query - 请求URL参数（获取AccessToken后默认会带上）
  * @param {String} body - POST请求的body（JSON需要JSON.stringify）
  * @param {String|Array} key - 返回数据中取出需要的key（不传全部ret返回）
  *
  * @returns {Promise}
  */
request(method, api, query, body, key)

// GET 方法简化接口
get(api, query, key)

// POST 方法简化接口
post(api, body, key)
```

### 企业应用

使用方法： [dingtalk.js](test/test-dingtalk.js)

```javascript
const DingTalk = require('super-dingtalk').DingTalk;

const client = new DingTalk({
  corpId: 'xxxxx',
  secret: 'xxxxx',
});
```

### 免登服务 

使用方法： [dtoauth.js](test/test-dtoauth.js)

```javascript
const DTOAuth = require('../lib').DTOAuth;

const oauth = new DTOAuth({
  appId: 'xxx',
  appSecret: 'xxx',
});

// 获取扫描登录链接
const url = oauth.getQRParmasUrl('http://blog.yourtion.com');
```

其他操作详见测试与相关文档

## 相关资源：

+ [钉钉服务端开发文档](https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.cffLIh&treeId=172&articleId=104981&docType=1)
+ [错误码解释](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.JJsHpJ&treeId=172&articleId=104965&docType=1)

## 免登接入 （DTOAuth）

- [X] 生成扫码登录URL `getQRParmasUrl(redirectUri)`
- [X] 获取钉钉开放应用 AccessToken `getToken()`
- [X] 获取用户授权的持久授权码 `getPersistentCode(tmpAuthCode)`
- [X] 获取用户授权的 SnsToken `getSnsToken(openId, persistentCode)`
- [X] 获取用户授权的个人信息 `getUserInfo(snsToken)`
- [X] 通过临时授权吗获取用户信息 `getUserInfoFromCode(tmpAuthCode)`

参考： [免登服务](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.OJgltA&treeId=168&articleId=104878&docType=1)

## 钉钉服务端 （DingTalk）

### 基础功能

- [x] 获取 AccessToken ``getToken()``
- [x] 获取 jsapi_ticket `getTicket()`
- [X] 获取 Web 端签名 `getSign(url)` 
- [X] 获取企业员工人数 `get('/user/get_org_user_count', { onlyActive: 0|1 }, 'count')`
- [ ] 服务端加密
- [ ] 服务端解密
- [ ] 记录统计数据
- [ ] 更新统计数据

### 管理通讯录

- [X] 获取部门列表 `get('/department/list', { id: 1|"parentid" }, 'department')`
- [X] 获取部门详情 `get('/department/get', { id: "department_id" })`
- [ ] 创建部门
- [ ] 更新部门
- [ ] 删除部门
- [X] 根据 unionid 获取成员的 userid `get('/user/getUseridByUnionid', { unionid }, 'userid')`
- [X] 获取成员详情 `get('/user/get', { userid })`
- [ ] 创建成员
- [ ] 创建成员
- [ ] 更新成员
- [ ] 删除成员
- [ ] 批量删除成员
- [x] 获取部门成员 `get('/user/simplelist', pamras, 'userlist')`
- [ ] 获取部门成员（详情）`get('/user/list', pamras, 'userlist')`
- [ ] 获取管理员列表

### 企业会话消息接口

- [x] 发送企业会话消息
- [ ] 获取企业会话消息已读未读状态
