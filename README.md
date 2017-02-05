# super-dingtalk

DingTalk client for Node.js 钉钉 Node.js 客户端

## 安装

```bash
$ npm install super-dingtalk --save
```

## 使用方法

```javascript
'use strict';

const DingTalk = require('super-dingtalk').DingTalk;

const client = new DingTalk({
  corpId: 'xxxxx',
  secret: 'xxxxx',
});

// 获取 AccessToken （调用其他操作前请先获取 AccessToken）
client.getToken()
  .then(ret => console.log('success', ret))
  .catch(err => console.log('error', err));
```

其他操作详见测试与相关文档

## 相关资源：

+ [钉钉服务端开发文档](https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.cffLIh&treeId=172&articleId=104981&docType=1)
+ [错误码解释](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.JJsHpJ&treeId=172&articleId=104965&docType=1)

## 功能

### 基础功能

- [x] 获取 AccessToken
- [x] 获取 jsapi_ticket
- [ ] 获取企业员工人数
- [ ] 服务端加密
- [ ] 服务端解密
- [ ] 记录统计数据
- [ ] 更新统计数据

### 管理通讯录

- [ ] 获取部门列表
- [ ] 获取部门详情
- [ ] 创建部门
- [ ] 更新部门
- [ ] 删除部门
- [ ] 根据 unionid 获取成员的 userid 
- [ ] 获取成员详情
- [ ] 创建成员
- [ ] 创建成员
- [ ] 更新成员
- [ ] 删除成员
- [ ] 批量删除成员
- [x] 获取部门成员
- [ ] 获取部门成员（详情）
- [ ] 获取管理员列表

### 企业会话消息接口

- [x] 发送企业会话消息
- [ ] 获取企业会话消息已读未读状态