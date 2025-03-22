# 甘特图组件使用详解

## 组件概述

`ElGanttWrapper`是一个功能丰富的甘特图组件，支持项目进度展示、动态列配置、项目筛选、自动进度计算等多种功能。本文档详细介绍组件的所有参数和使用方法。

## 项目数据格式

甘特图组件接受一个标准格式的项目数据数组，每个项目对象应包含以下字段：

```js
{
  index: Number,           // 项目序号 (必填)
  projName: String,        // 项目名称 (必填)
  startDate: String,       // 开始日期，格式为"YYYY-MM" (必填)
  endDate: String,         // 结束日期，格式为"YYYY-MM" (必填)
  status: String,          // 项目状态，可选值："已完成"、"进行中"、"计划中"、"延期中"
  progress: Number,        // 进度百分比 (0-100)
  extraFields: [           // 额外字段数组 (可选)
    {
      propName: String,    // 属性名，用于内部标识
      columnName: String,  // 列名，显示在表头
      value: String,       // 字段值
      show: Number,        // 是否默认显示 (1显示，0不显示)
      align: String        // 对齐方式 ('left', 'center', 'right')
    }
  ]
}
```

## 基本用法

### 简单示例

```vue
<template>
  <div>
    <el-gantt-wrapper
      :projects="projectList"
      :showFilter="true"
      :showColumnControl="true"
      :maxVisibleRows="10"
      @row-action="handleProjectClick"
    />
  </div>
</template>

<script>
import ElGanttWrapper from '@/components/ElGanttWrapper.vue';

export default {
  components: {
    ElGanttWrapper
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
            { propName: "manager", columnName: "负责人", value: "张三", show: 1, align: "center" },
            { propName: "priority", columnName: "优先级", value: "高", show: 1, align: "center" }
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
            { propName: "manager", columnName: "负责人", value: "李四", show: 1, align: "center" },
            { propName: "priority", columnName: "优先级", value: "中", show: 1, align: "center" }
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

### 自定义布局示例

```vue
<template>
  <div>
    <el-gantt-wrapper
      :projects="projectList"
      :showFilter="true"
      :showColumnControl="true"
      :cellWidth="60"
      :rowHeight="50"
      :headerHeight="80"
      :projectNameColumnWidth="200"
      :statusColumnWidth="100"
      :operationColumnWidth="150"
      :maxVisibleRows="8"
      @row-action="handleProjectClick"
    />
  </div>
</template>
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
    
    <el-gantt-wrapper
      :projects="projectList"
      :showFilter="true"
      :showColumnControl="true"
      :autoCalculateProgress="useAutoProgress"
      :currentMonth="currentMonthValue"
      @row-action="handleProjectClick"
    />
  </div>
</template>

<script>
import ElGanttWrapper from '@/components/ElGanttWrapper.vue';

export default {
  components: {
    ElGanttWrapper
  },
  data() {
    return {
      useAutoProgress: false, // 默认使用原始进度
      currentMonthValue: '2023-06', // 可以指定当前月份，不指定则使用系统当前日期
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
          startDate: "2023-02",
          endDate: "2023-07",
          status: "进行中",
          progress: 30,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "李四", show: 1 },
            { propName: "priority", columnName: "优先级", value: "中", show: 1 }
          ]
        },
        {
          index: 3,
          projName: "项目C",
          startDate: "2023-05",
          endDate: "2023-10",
          status: "计划中",
          progress: 0,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "王五", show: 1 },
            { propName: "priority", columnName: "优先级", value: "低", show: 1 }
          ]
        }
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

## 自定义操作列

组件支持自定义操作列的内容，通过插槽可以灵活定制操作按钮：

```vue
<template>
  <div>
    <el-gantt-wrapper
      :projects="projectList"
      :showFilter="true"
    >
      <!-- 自定义操作列 -->
      <template #operation="{ row }">
        <el-button size="mini" type="primary" @click="viewDetails(row)">查看</el-button>
        <el-button size="mini" type="success" @click="editProject(row)">编辑</el-button>
      </template>
    </el-gantt-wrapper>
  </div>
</template>

<script>
export default {
  methods: {
    viewDetails(project) {
      console.log('查看项目详情:', project);
    },
    editProject(project) {
      console.log('编辑项目:', project);
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

### 自动计算进度的实现代码

```js
// 计算单个项目的进度和状态
calculateProjectProgress(project, currentDate) {
  // 如果没有传入当前日期，则使用系统当前日期
  const now = currentDate || new Date();
  
  // 解析项目的开始和结束日期
  const startDate = new Date(`${project.startDate}-01`);
  const endDate = new Date(`${project.endDate}-01`);
  endDate.setMonth(endDate.getMonth() + 1); // 设为下个月的第一天，以包含整个月
  endDate.setDate(endDate.getDate() - 1); // 设为当月的最后一天
  
  // 如果当前日期早于开始日期，项目尚未开始
  if (now < startDate) {
    return { 
      progress: 0,
      status: '计划中'
    };
  }
  
  // 如果当前日期晚于结束日期，项目已经完成
  if (now > endDate) {
    return { 
      progress: 100,
      status: '已完成'
    };
  }
  
  // 计算项目总时长（毫秒）
  const totalDuration = endDate - startDate;
  
  // 计算已经过去的时间（毫秒）
  const elapsedTime = now - startDate;
  
  // 计算进度百分比
  let progress = Math.floor((elapsedTime / totalDuration) * 100);
  
  // 确保进度在0-100范围内
  progress = Math.max(0, Math.min(100, progress));
  
  // 根据进度确定状态
  let status;
  if (progress >= 100) {
    status = '已完成';
  } else {
    // 检查是否有原始进度数据，用于比较实际进度和预期进度
    const originalProgress = project.originalProgress !== undefined ? 
                          project.originalProgress : 
                          project.progress;
    
    // 如果实际进度落后于当前应达到的进度（有一定容忍度），则标记为延期
    if (originalProgress !== undefined && originalProgress < progress - 15) {
      status = '延期中';
    } else {
      status = '进行中';
    }
  }
  
  return { progress, status };
}
```

## 项目状态说明

组件能够处理以下状态：

- **计划中**：项目尚未开始
- **进行中**：项目正在按计划进行
- **延期中**：项目进度落后于自动计算的进度（仅在自动计算模式下会出现）
- **已完成**：项目已经完成（进度为100%）

### 状态颜色对应关系

组件会根据状态和进度值设置不同的颜色：

- **计划中**：灰色
- **进行中**：
  - 进度 < 30%：红色
  - 30% <= 进度 < 60%：橙色
  - 60% <= 进度 < 100%：蓝色
- **延期中**：红色
- **已完成**：绿色

## 应用场景

自动计算进度模式特别适合于：
- 需要根据实际日期动态显示项目进度的场景
- 需要自动标识延期项目的场景
- 演示或模拟项目进展的场景
- 项目规划和预测
- 项目监控报表
- 项目演示和展示

## 动态列配置

启用 `showColumnControl` 后，用户可以动态选择显示哪些列。额外的列信息由 `extraFields` 定义：

```js
{
  extraFields: [
    { propName: "manager", columnName: "负责人", value: "张三", show: 1, align: "center" },
    { propName: "priority", columnName: "优先级", value: "高", show: 1, align: "center" },
    { propName: "budget", columnName: "预算", value: "100万", show: 0, align: "right" },
    { propName: "department", columnName: "所属部门", value: "研发部", show: 0, align: "left" }
  ]
}
```

其中 `show` 为 1 的列会默认显示，用户可以通过列控制面板动态切换。

## 过滤功能

启用 `showFilter` 后，用户可以根据项目状态过滤显示的项目：

- **所有项目**：显示所有项目
- **已完成项目**：只显示状态为"已完成"的项目
- **进行中项目**：显示状态为"进行中"或"延期中"的项目

## API完整参考

### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| projects | Array | [] | 项目数据数组，包含要显示的项目信息 |
| cellWidth | Number | 50 | 月份单元格的宽度，影响甘特图的水平比例 |
| rowHeight | Number | 60 | 行高，决定每个项目条目的高度 |
| headerHeight | Number | 72 | 头部高度，包含年份行和月份行的高度总和 |
| showColumnControl | Boolean | false | 是否显示列控制面板，用于自定义显示哪些动态列 |
| currentMonth | String | 当前月份 | 当前年月，格式为YYYY-MM，如不提供则使用系统当前日期 |
| filter | String | 'all' | 项目筛选条件，可选值：all(所有)、completed(已完成)、inProgress(进行中) |
| showFilter | Boolean | false | 是否显示项目筛选器 |
| maxVisibleRows | Number | 10 | 甘特图最大显示的行数，超过该数值的项目需要通过滚动查看 |
| projectNameColumnWidth | Number | 150 | 项目名称列的宽度 |
| statusColumnWidth | Number | 80 | 状态列的宽度 |
| operationColumnWidth | Number | 120 | 操作列的宽度 |
| autoCalculateProgress | Boolean | false | 是否根据当前日期自动计算项目进度，而不是使用原始数据中的进度值 |

### 事件

| 事件名 | 参数 | 说明 |
|------|------|------|
| row-action | project | 当点击项目行或操作按钮时触发，参数为当前项目对象 |
| filter-change | filter | 当项目筛选条件变化时触发，参数为当前筛选条件 |
| columns-change | columns | 当选择的列变化时触发，参数为当前选中的列 propName 数组 |

### 插槽

| 插槽名 | 插槽参数 | 说明 |
|------|---------|------|
| operation | { row } | 自定义操作列的内容，row 为当前行的项目数据 |

## 示例：完整功能演示

```vue
<template>
  <div class="gantt-demo-container">
    <h2>项目甘特图</h2>
    
    <div class="gantt-controls">
      <el-switch
        v-model="useAutoProgress"
        active-text="自动计算进度"
        inactive-text="使用原始进度"
        @change="handleProgressModeChange"
      />
      
      <el-date-picker
        v-if="useAutoProgress"
        v-model="simulationDate"
        type="month"
        placeholder="选择模拟日期"
        format="yyyy-MM"
        value-format="yyyy-MM"
        @change="handleDateChange"
      />
    </div>
    
    <el-gantt-wrapper
      ref="ganttChart"
      :projects="projectList"
      :showFilter="true"
      :showColumnControl="true"
      :autoCalculateProgress="useAutoProgress"
      :currentMonth="currentMonthValue"
      :maxVisibleRows="15"
      :cellWidth="60"
      @row-action="handleProjectClick"
      @filter-change="handleFilterChange"
      @columns-change="handleColumnsChange"
    >
      <template #operation="{ row }">
        <el-button size="mini" type="primary" @click.stop="viewDetails(row)">详情</el-button>
        <el-button size="mini" type="success" @click.stop="editProject(row)">编辑</el-button>
      </template>
    </el-gantt-wrapper>
    
    <!-- 项目详情对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="项目详情" width="600px">
      <div v-if="selectedProject">
        <h3>{{ selectedProject.projName }}</h3>
        <p><strong>开始日期:</strong> {{ selectedProject.startDate }}</p>
        <p><strong>结束日期:</strong> {{ selectedProject.endDate }}</p>
        <p><strong>状态:</strong> {{ selectedProject.status }}</p>
        <p><strong>进度:</strong> {{ selectedProject.progress }}%</p>
        <div v-if="selectedProject.extraFields">
          <p v-for="field in selectedProject.extraFields" :key="field.propName">
            <strong>{{ field.columnName }}:</strong> {{ field.value }}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElGanttWrapper from '@/components/ElGanttWrapper.vue';

export default {
  components: {
    ElGanttWrapper
  },
  data() {
    return {
      useAutoProgress: false,
      simulationDate: '',
      currentMonthValue: '',
      dialogVisible: false,
      selectedProject: null,
      projectList: [
        // 完整的项目数据
        {
          index: 1,
          projName: "网站改版",
          startDate: "2023-01",
          endDate: "2023-06",
          status: "进行中",
          progress: 65,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "张三", show: 1, align: "center" },
            { propName: "priority", columnName: "优先级", value: "高", show: 1, align: "center" },
            { propName: "budget", columnName: "预算", value: "50万", show: 0, align: "right" },
            { propName: "department", columnName: "所属部门", value: "IT部门", show: 0, align: "left" }
          ]
        },
        {
          index: 2,
          projName: "移动应用开发",
          startDate: "2023-02",
          endDate: "2023-08",
          status: "进行中",
          progress: 40,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "李四", show: 1, align: "center" },
            { propName: "priority", columnName: "优先级", value: "中", show: 1, align: "center" },
            { propName: "budget", columnName: "预算", value: "80万", show: 0, align: "right" },
            { propName: "department", columnName: "所属部门", value: "研发部", show: 0, align: "left" }
          ]
        },
        {
          index: 3,
          projName: "数据中心建设",
          startDate: "2023-04",
          endDate: "2023-12",
          status: "计划中",
          progress: 10,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "王五", show: 1, align: "center" },
            { propName: "priority", columnName: "优先级", value: "高", show: 1, align: "center" },
            { propName: "budget", columnName: "预算", value: "200万", show: 0, align: "right" },
            { propName: "department", columnName: "所属部门", value: "基础设施部", show: 0, align: "left" }
          ]
        },
        {
          index: 4,
          projName: "市场营销活动",
          startDate: "2023-03",
          endDate: "2023-05",
          status: "已完成",
          progress: 100,
          extraFields: [
            { propName: "manager", columnName: "负责人", value: "赵六", show: 1, align: "center" },
            { propName: "priority", columnName: "优先级", value: "中", show: 1, align: "center" },
            { propName: "budget", columnName: "预算", value: "30万", show: 0, align: "right" },
            { propName: "department", columnName: "所属部门", value: "市场部", show: 0, align: "left" }
          ]
        }
      ]
    };
  },
  methods: {
    handleProjectClick(project) {
      this.selectedProject = project;
      this.dialogVisible = true;
    },
    viewDetails(project) {
      this.selectedProject = project;
      this.dialogVisible = true;
    },
    editProject(project) {
      console.log('编辑项目:', project);
      // 在这里实现编辑功能
    },
    handleProgressModeChange(value) {
      console.log('进度计算模式已切换:', value ? '自动计算' : '原始数据');
    },
    handleDateChange(date) {
      this.currentMonthValue = date;
      console.log('模拟日期已更改为:', date);
    },
    handleFilterChange(filter) {
      console.log('筛选条件已更改为:', filter);
    },
    handleColumnsChange(columns) {
      console.log('显示的列已更改为:', columns);
    }
  }
};
</script>

<style>
.gantt-demo-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.gantt-controls {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
```
