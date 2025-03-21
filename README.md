# Vue2 + ElementUI 甘特图组件

这是一个基于Vue2和ElementUI开发的甘特图组件，具有动态列控制、项目过滤、自适应设计等特性。

## 特性

- ✅ 响应式设计，适应不同屏幕尺寸
- ✅ 动态列控制，可自定义显示/隐藏列
- ✅ 内置项目过滤功能
- ✅ 表格与甘特图区域滚动同步
- ✅ 项目进度条可视化
- ✅ 项目状态颜色区分
- ✅ 支持自定义样式和主题

## 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/gantt-demo.git

# 进入项目目录
cd gantt-demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 基本用法

```vue
<template>
  <CustomGanttDemoFixed
    :projects="projects"
    :show-column-control="true"
    @project-click="handleProjectClick"
  />
</template>

<script>
import CustomGanttDemoFixed from './components/CustomGanttDemoFixed.vue';
import { mockProjects } from './mockData';

export default {
  components: {
    CustomGanttDemoFixed
  },
  data() {
    return {
      projects: mockProjects
    };
  },
  methods: {
    handleProjectClick(project) {
      console.log('项目被点击:', project);
    }
  }
};
</script>
```

## 属性和事件

### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| projects | Array | [] | 项目数据数组 |
| showColumnControl | Boolean | false | 是否显示列控制面板 |
| headerHeight | Number | 40 | 表头高度(px) |
| rowHeight | Number | 44 | 行高(px) |
| extraProps | Object | null | 额外传递给组件的属性 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| project-click | project | 当项目被点击时触发 |
| project-filter-change | filteredProjects | 当项目过滤条件变化时触发 |

## 数据格式

项目数据对象应具有以下结构：

```javascript
{
  index: Number,           // 唯一索引
  projName: String,        // 项目名称
  manager: String,         // 项目经理
  priority: String,        // 优先级
  startDate: String,       // 开始日期 (格式: YYYY-MM)
  endDate: String,         // 结束日期 (格式: YYYY-MM)
  progress: Number,        // 进度百分比 (0-100)
  status: String,          // 项目状态
  extraFields: [           // 动态列字段
    {
      columnName: String,  // 列名称
      propName: String,    // 属性名
      value: String,       // 值
      show: Number         // 是否显示 (1显示，0不显示)
    }
  ]
}
```

## 开发心得与总结

在开发这个甘特图组件的过程中，我得到了以下重要经验和教训：

### 组件设计

1. **组件封装原则**: 开发过程中逐步将功能封装到组件内部，减少对外部依赖，提高复用性。与其向父组件暴露太多内部状态，不如使用声明式属性控制组件行为。

2. **状态管理**: 在该组件中实现了内部状态管理，将动态列控制逻辑和过滤逻辑集成到组件内，提高了内聚性。

3. **清晰的API设计**: 通过精简的props和events接口提供了足够的灵活性，同时保持了使用的简洁性。

### 技术挑战

1. **同步滚动问题**: 表格与甘特图区域的同步滚动是一个挑战点。通过监听滚动事件并互相同步位置解决了这个问题，但需要注意防止循环触发。

2. **图表与表格对齐**: 确保甘特图中的水平网格线与表格行完全对齐是个难点，最终通过精确计算高度和位置解决。

3. **动态列渲染**: 基于数据动态渲染列需要考虑性能问题和响应式更新，通过computed属性和适当的条件渲染实现。

### UI/UX考虑

1. **响应式设计**: 组件能够适应不同屏幕尺寸，通过百分比和flex布局确保在各种环境下都能良好展示。

2. **用户控制**: 提供了列控制面板，让用户可以自定义显示哪些列，增强了用户体验。

3. **视觉反馈**: 通过颜色、进度条和交互效果提供清晰的视觉反馈，帮助用户理解项目状态。

### 性能优化

1. **减少DOM操作**: 尽可能减少直接DOM操作，利用Vue的虚拟DOM特性。

2. **事件节流**: 对滚动等高频事件使用节流/防抖技术，避免性能问题。

3. **条件渲染**: 使用v-if/v-show适当控制元素的渲染时机，减少不必要的计算。

### 可维护性

1. **代码组织**: 将复杂逻辑分解为小函数，提高代码可读性和可维护性。

2. **命名规范**: 使用一致的命名约定，确保代码易于理解和维护。

3. **CSS模块化**: 使用scoped CSS和命名空间避免样式冲突，提高样式的可维护性。

## 浏览器兼容性

该组件已在以下浏览器中测试通过：

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 注意事项

- 日期格式必须为`YYYY-MM`格式
- 项目数据中的extraFields是实现动态列的关键，请确保数据格式正确

## 许可证

MIT 