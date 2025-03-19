<template>
  <div class="gantt-demo">
    <h2>v-gantt-chart 实现</h2>
    
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
      <v-gantt-chart
        :startTime="startTime"
        :endTime="endTime"
        :datas="ganttData"
        :cellWidth="60"
        :cellHeight="40"
        :titleWidth="0"
        :scale="3"
        :showCurrentTime="true"
        :handleBarClick="handleBarClick">
      </v-gantt-chart>
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
import vGanttChart from 'v-gantt-chart';

export default {
  name: 'VGanttChartDemo',
  components: {
    vGanttChart
  },
  data() {
    return {
      projectsData: [],
      ganttData: [],
      startTime: '',
      endTime: '',
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
      
      // 查找最早和最晚的日期
      let minDate = new Date('2099-12');
      let maxDate = new Date('2000-01');
      
      mockProjects.forEach(project => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        if (startDate < minDate) {
          minDate = startDate;
        }
        
        if (endDate > maxDate) {
          maxDate = endDate;
        }
      });
      
      // 设置甘特图的开始和结束时间
      // 确保时间范围包含完整的月份
      this.startTime = `${minDate.getFullYear()}-${(minDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
      
      // 结束日期设置为下个月的第一天
      const endMonth = maxDate.getMonth() + 1;
      const endYear = maxDate.getFullYear() + (endMonth > 11 ? 1 : 0);
      this.endTime = `${endYear}-${(endMonth % 12 + 1).toString().padStart(2, '0')}-01`;
      
      // 转换为v-gantt-chart所需的数据格式
      this.ganttData = mockProjects.map(project => {
        return {
          id: project.id,
          name: project.name,
          start: new Date(`${project.startDate}-01`),
          end: new Date(`${project.endDate}-01`),
          progress: project.progress,
          style: {
            // 根据完成进度设置颜色
            background: this.getColorByProgress(project.progress)
          }
        };
      });
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
    handleBarClick(data) {
      const project = this.projectsData.find(p => p.id === data.id);
      if (project) {
        this.currentProject = project;
        this.dialogVisible = true;
      }
    }
  }
};
</script>

<style scoped>
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
  overflow: hidden;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

h2 {
  text-align: left;
  margin: 10px 0 20px;
  color: #303133;
}
</style> 