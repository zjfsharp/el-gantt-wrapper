# 甘特图组件使用示例

## 基本用法

```vue
<template>
  <div>
    <custom-gantt-demo-fixed
      :projects="projectList"
      :showFilter="true"
      :showColumnControl="true"
      :maxVisibleRows="10"
      @row-action="handleProjectClick"
    />
  </div>
</template>

<script>
import CustomGanttDemoFixed from '@/components/CustomGanttDemoFixed.vue';

export default {
  components: {
    CustomGanttDemoFixed
  },
  data() {
    return {
      projectList: [
        {
          index: 1,
          projName: "项目A",
          startDate: "2023-01",
          endDate: "2023-06",
          status: "进行中",
          progress: 65,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "张三", show: 1 },
            { propName: "priority", columnName: "优先级", value: "高", show: 1 }
          ]
        },
        {
          index: 2,
          projName: "项目B",
          startDate: "2023-03",
          endDate: "2023-08",
          status: "进行中",
          progress: 40,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "李四", show: 1 },
            { propName: "priority", columnName: "优先级", value: "中", show: 1 }
          ]
        },
        // ... 更多项目
      ]
    };
  },
  methods: {
    handleProjectClick(project) {
      console.log('点击了项目:', project);
      // 在这里处理项目点击事件
    }
  }
};
</script>
```

## 使用自动计算进度功能

新增的 `autoCalculateProgress` 属性允许组件根据当前日期自动计算项目进度和状态，而不是使用原始数据中的进度值。

```vue
<template>
  <div>
    <div class="controls">
      <el-switch
        v-model="useAutoProgress"
        active-text="自动计算进度"
        inactive-text="使用原始进度"
      />
    </div>
    
    <custom-gantt-demo-fixed
      :projects="projectList"
      :showFilter="true"
      :showColumnControl="true"
      :autoCalculateProgress="useAutoProgress"
      @row-action="handleProjectClick"
    />
  </div>
</template>

<script>
import CustomGanttDemoFixed from '@/components/CustomGanttDemoFixed.vue';

export default {
  components: {
    CustomGanttDemoFixed
  },
  data() {
    return {
      useAutoProgress: false, // 默认使用原始进度
      projectList: [
        {
          index: 1,
          projName: "项目A",
          startDate: "2023-01",
          endDate: "2023-06",
          status: "进行中",
          progress: 65,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "张三", show: 1 },
            { propName: "priority", columnName: "优先级", value: "高", show: 1 }
          ]
        },
        // ... 更多项目
      ]
    };
  },
  methods: {
    handleProjectClick(project) {
      console.log('点击了项目:', project);
      // 在这里处理项目点击事件
    }
  }
};
</script>
```

## 自动计算进度的工作原理

当启用 `autoCalculateProgress` 时，组件会：

1. 保存项目原始进度数据（存储在 `originalProgress` 属性中）
2. 根据当前日期计算项目进度：
   - 如果当前日期早于项目开始日期，进度为 0%，状态为"计划中"
   - 如果当前日期晚于项目结束日期，进度为 100%，状态为"已完成"
   - 如果当前日期在项目时间范围内，进度根据已过去的时间比例计算
   - 如果实际进度（原始数据中的进度）落后于自动计算的预期进度 15% 以上，状态更改为"延期中"
3. 进度条颜色会根据项目状态和进度值进行调整
4. 当前日期指示器会显示"自动计算进度"标识

## 项目状态说明

组件能够处理以下状态：

- **计划中**：项目尚未开始
- **进行中**：项目正在按计划进行
- **延期中**：项目进度落后于自动计算的进度（仅在自动计算模式下会出现）
- **已完成**：项目已经完成（进度为100%）

自动计算模式特别适合于：
- 需要根据实际日期动态显示项目进度的场景
- 需要自动标识延期项目的场景
- 演示或模拟项目进展的场景

## API参考

| 属性 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| autoCalculateProgress | Boolean | false | 是否自动计算项目进度和状态 |
| projects | Array | [] | 项目数据数组 |
| showFilter | Boolean | false | 是否显示项目筛选器 |
| showColumnControl | Boolean | false | 是否显示列控制面板 |
| maxVisibleRows | Number | 10 | 最大可见行数 |
| cellWidth | Number | 50 | 月份单元格宽度 |
| rowHeight | Number | 60 | 行高 |
| headerHeight | Number | 72 | 头部高度 |
| currentMonth | String | 当前月份 | 当前年月，格式为YYYY-MM |

| 事件 | 参数 | 说明 |
|------|------|------|
| row-action | project | 当点击项目行时触发 |
| filter-change | filter | 当项目筛选条件变化时触发 |
| columns-change | columns | 当选择的列变化时触发 |
