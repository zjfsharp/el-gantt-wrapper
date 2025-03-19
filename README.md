# Vue2 + ElementUI 甘特图实现方案

这个项目提供了在Vue2 + ElementUI架构下实现甘特图的四种不同方案，旨在满足以下需求：

1. 甘特图时间维度为年份和月份，不需要到日级别
2. 在进度中体现当前处于哪个月份，用竖线显示
3. 甘特图每行代表一个具体的项目，支持基本的字段显示以及操作列（如进度详情查看）
4. 只有甘特图进度部分可左右滑动

## 实现方案

本项目提供了四种不同的甘特图实现方案供您选择：

1. **v-gantt-chart 实现**: 一个轻量级的Vue甘特图组件，支持自定义配置和事件处理。
2. **frappe-gantt 实现**: 一个功能强大的甘特图库，可以调整显示粒度。
3. **vue-ganttastic 实现**: 专为Vue设计的甘特图组件，API简单易用。
4. **ElementUI 自定义实现**: 基于ElementUI组件自行实现的甘特图，可完全控制样式和功能。

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
gantt-demo/
├── public/                  # 静态资源
│   └── index.html           # HTML模板
├── src/                     # 源代码
│   ├── assets/              # 资源文件（图片等）
│   ├── components/          # 组件
│   │   ├── VGanttChartDemo.vue     # v-gantt-chart实现
│   │   ├── FrappeGanttDemo.vue     # frappe-gantt实现
│   │   ├── VueGanttasticDemo.vue   # vue-ganttastic实现
│   │   └── CustomGanttDemo.vue     # ElementUI自定义实现
│   ├── mockData.js          # 模拟数据
│   ├── App.vue              # 应用主组件
│   └── main.js              # 应用入口
├── .babelrc                 # Babel配置
├── package.json             # 依赖和脚本
├── webpack.config.js        # Webpack配置
└── README.md                # 项目文档
```

## 主要功能

1. 显示项目时间跨度（年月维度）
2. 根据数据动态计算甘特图时间范围
3. 显示当前月份标记
4. 项目进度条显示
5. 进度查询功能
6. 根据项目进度和状态显示不同颜色

## 定制化

每种实现方案都支持定制化：

- 自定义颜色和样式
- 自定义显示字段
- 自定义数据结构
- 自定义交互行为

## 兼容性

本项目基于Vue2和ElementUI开发，兼容所有支持Vue2的现代浏览器。 