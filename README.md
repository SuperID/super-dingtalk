# super-dingtalk

DingTalk client for Node.js 钉钉 Node.js 客户端

## 安装

```bash
$ npm install super-dingtalk --save
```

## 使用方法

```javascript
'use strict';

const DingTalk = require('super-dingtalk');

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

相关资源：

+ [钉钉服务端开发文档](https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.cffLIh&treeId=172&articleId=104981&docType=1)
+ [错误码解释](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.JJsHpJ&treeId=172&articleId=104965&docType=1)

