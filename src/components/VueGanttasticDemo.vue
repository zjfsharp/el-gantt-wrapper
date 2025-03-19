<template>
  <div class="gantt-demo">
    <h2>vue-ganttastic 实现</h2>
    
    <!-- 项目基本信息表格 -->
    <div class="table-container">
      <el-table
        :data="projectsData"
        style="width: 100%"
        height="300">
        <el-table-column
          fixed
          prop="name"
          label="项目名称"
          width="150">
        </el-table-column>
        <el-table-column
          fixed
          prop="manager"
          label="负责人"
          width="100">
        </el-table-column>
        <el-table-column
          fixed
          prop="priority"
          label="优先级"
          width="80">
          <template slot-scope="scope">
            <el-tag :type="getPriorityType(scope.row.priority)">{{ scope.row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="progress"
          label="进度"
          width="150">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress" :status="getProgressStatus(scope.row.progress)"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="status"
          label="状态"
          width="80">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 甘特图容器 -->
    <div class="gantt-wrapper">
      <GGanttChart
        chart-start="2022-01-01"
        :chart-end="chartEnd"
        precision="month"
        grid
        :row-height="30"
        :bar-height="20"
        :include-today-line="true"
        @bar-click="handleBarClick">
        <GGanttRow
          v-for="project in ganttData"
          :key="project.id"
          :label="project.name"
          :bars="[project]"
          :highlightOnHover="true">
        </GGanttRow>
      </GGanttChart>
    </div>
    
    <!-- 项目详情对话框 -->
    <el-dialog
      title="项目详情"
      :visible.sync="dialogVisible"
      width="30%">
      <div v-if="currentProject">
        <p><strong>项目名称：</strong>{{ currentProject.name }}</p>
        <p><strong>负责人：</strong>{{ currentProject.manager }}</p>
        <p><strong>优先级：</strong>{{ currentProject.priority }}</p>
        <p><strong>开始时间：</strong>{{ currentProject.startDate }}</p>
        <p><strong>结束时间：</strong>{{ currentProject.endDate }}</p>
        <p><strong>进度：</strong>{{ currentProject.progress }}%</p>
        <p><strong>状态：</strong>{{ currentProject.status }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mockProjects, getCurrentYearMonth } from '../mockData';
import { GGanttChart, GGanttRow } from 'vue-ganttastic';

export default {
  name: 'VueGanttasticDemo',
  components: {
    GGanttChart,
    GGanttRow
  },
  data() {
    return {
      projectsData: [],
      ganttData: [],
      chartEnd: '',
      dialogVisible: false,
      currentProject: null
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.projectsData = mockProjects;
      
      // 查找最晚的结束日期
      let maxDate = new Date('2000-01');
      mockProjects.forEach(project => {
        const endDate = new Date(project.endDate);
        if (endDate > maxDate) {
          maxDate = endDate;
        }
      });
      
      // 设置甘特图的结束时间（增加一个月以确保显示完整）
      const endMonth = maxDate.getMonth() + 1;
      const endYear = maxDate.getFullYear() + (endMonth > 11 ? 1 : 0);
      this.chartEnd = `${endYear}-${(endMonth % 12 + 1).toString().padStart(2, '0')}-01`;
      
      // 转换为vue-ganttastic所需的数据格式
      this.ganttData = mockProjects.map(project => {
        return {
          id: project.id,
          label: project.name,
          startDate: `${project.startDate}-01`,
          endDate: this.getLastDayOfMonth(project.endDate),
          progress: project.progress / 100,
          style: {
            // 根据完成进度设置颜色
            background: this.getColorByProgress(project.progress)
          },
          originalData: project
        };
      });
    },
    getLastDayOfMonth(yearMonth) {
      const parts = yearMonth.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      // 获取下个月的第0天，即本月的最后一天
      const lastDay = new Date(year, month, 0).getDate();
      return `${yearMonth}-${lastDay}`;
    },
    getColorByProgress(progress) {
      if (progress >= 100) {
        return '#67C23A'; // 已完成
      } else if (progress >= 60) {
        return '#409EFF'; // 进行中（高进度）
      } else if (progress >= 30) {
        return '#E6A23C'; // 进行中（中进度）
      } else {
        return '#F56C6C'; // 进行中（低进度）
      }
    },
    getPriorityType(priority) {
      switch (priority) {
        case '高': return 'danger';
        case '中': return 'warning';
        case '低': return 'info';
        default: return '';
      }
    },
    getProgressStatus(progress) {
      if (progress >= 100) {
        return 'success';
      } else if (progress >= 60) {
        return '';
      } else if (progress >= 30) {
        return 'warning';
      } else {
        return 'exception';
      }
    },
    getStatusType(status) {
      switch (status) {
        case '已完成': return 'success';
        case '进行中': return 'primary';
        case '计划中': return 'info';
        default: return '';
      }
    },
    handleDetail(row) {
      this.currentProject = row;
      this.dialogVisible = true;
    },
    handleBarClick(bar) {
      const project = this.projectsData.find(p => p.id === bar.id);
      if (project) {
        this.currentProject = project;
        this.dialogVisible = true;
      }
    }
  }
};
</script>

<style>
.gantt-demo {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px;
}

.table-container {
  margin-bottom: 20px;
}

.gantt-wrapper {
  flex: 1;
  overflow: auto;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  min-height: 300px;
}

h2 {
  text-align: left;
  margin: 10px 0 20px;
  color: #303133;
}

/* 甘特图样式调整 */
.g-gantt-chart .g-gantt-today-line {
  border-width: 2px;
  border-color: red;
}

.g-gantt-chart .g-gantt-chart-sections-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.g-gantt-chart .g-gantt-bar-label {
  font-weight: bold;
}
</style> 