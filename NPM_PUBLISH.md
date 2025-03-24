# 将甘特图组件发布到NPM
## 将甘特图组件发布到NPM的步骤总结
### 1. 准备文件结构
创建以下文件：
- `src/index.js`：作为组件的入口文件
- `webpack.config.npm.js`：专门用于构建NPM包的webpack配置
- `.npmignore`：排除不需要发布的文件
- 更新了`README.md`：使其符合NPM包的标准
- 创建了`LICENSE`：MIT许可证文件

### 2. 配置package.json
修改package.json，添加了以下重要字段：
- `version`: "0.1.1"（按照你的要求）
- `main`, `module`, `unpkg`：指定不同环境下的入口文件
- `files`：指定要包含在发布包中的文件和目录
- `peerDependencies`：指定Vue和ElementUI作为对等依赖
- 添加了`build:npm`和`prepublishOnly`脚本

### 3. 构建和测试
1. 运行了`npm run build:npm`来构建组件
2. 使用`npm pack`来测试生成的包内容

### 4. 发布步骤
要发布到NPM，请按照以下步骤操作：
1. 确保已经注册了NPM账户
2. 在终端中登录到你的NPM账户：
```bash
npm login
```
3. 输入用户名、密码和电子邮件
4. 发布包：
```bash
npm publish
```

发布成功后，其他开发者就可以通过以下命令安装你的组件：
```bash
npm install el-gantt-wrapper --save
```

### 5. 使用方法

使用者可以通过以下两种方式使用组件：

#### 全局注册
```js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { ElGanttWrapperPlugin } from 'el-gantt-wrapper';

Vue.use(ElementUI);
Vue.use(ElGanttWrapperPlugin);
```

#### 局部注册
```vue
<template>
  <ElGanttWrapper :projects="projects" />
</template>

<script>
import { ElGanttWrapper } from 'el-gantt-wrapper';

export default {
  components: {
    ElGanttWrapper
  },
  // ...
}
</script>
```

### 6. 版本更新

更新组件时:
1. 修改`package.json`中的`version`字段
2. 运行`npm run build:npm`重新构建
3. 运行`npm publish`发布新版本
