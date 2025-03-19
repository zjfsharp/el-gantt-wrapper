<template>
  <div class="gantt-demo">
    <h2>frappe-gantt 实现</h2>
    
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
    
    <!-- 甘特图设置按钮 -->
    <div class="gantt-controls">
      <el-radio-group v-model="viewMode" size="small" @change="updateViewMode">
        <el-radio-button label="Month">按月</el-radio-button>
        <el-radio-button label="Quarter Day">按季度</el-radio-button>
        <el-radio-button label="Year">按年</el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- 甘特图容器 -->
    <div class="gantt-wrapper">
      <div ref="gantt" class="frappe-gantt"></div>
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
import Gantt from 'frappe-gantt';
// 修改：改用CDN引入CSS，避免打包问题
// import 'frappe-gantt/dist/frappe-gantt.css';

export default {
  name: 'FrappeGanttDemo',
  data() {
    return {
      projectsData: [],
      ganttData: [],
      ganttChart: null,
      viewMode: 'Month',
      dialogVisible: false,
      currentProject: null
    };
  },
  mounted() {
    // 添加CSS样式
    this.addFrappeGanttStyles();
    this.initData();
  },
  methods: {
    // 添加样式方法
    addFrappeGanttStyles() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/frappe-gantt@0.6.1/dist/frappe-gantt.css';
      document.head.appendChild(link);
    },
    initData() {
      this.projectsData = mockProjects;
      
      // 转换为frappe-gantt所需的数据格式
      this.ganttData = mockProjects.map(project => {
        const startDate = new Date(`${project.startDate}-01`);
        // 设置结束日期为当月最后一天
        const endDateParts = project.endDate.split('-');
        const year = parseInt(endDateParts[0]);
        const month = parseInt(endDateParts[1]);
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = new Date(`${project.endDate}-${lastDay}`);
        
        return {
          id: project.id,
          name: project.name,
          start: startDate,
          end: endDate,
          progress: project.progress / 100,
          custom_class: this.getProgressClass(project.progress)
        };
      });
      
      // 初始化甘特图
      this.$nextTick(() => {
        this.initGanttChart();
      });
    },
    initGanttChart() {
      // 获取当前日期
      const currentDate = new Date();
      
      // 创建甘特图实例
      this.ganttChart = new Gantt(this.$refs.gantt, this.ganttData, {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_mode: this.viewMode,
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_modes: ['Quarter Day', 'Month', 'Year'],
        custom_popup_html: null,
        on_click: (task) => {
          this.handleGanttItemClick(task);
        },
        on_date_change: (task, start, end) => {
          // 只读，不处理
        },
        on_progress_change: (task, progress) => {
          // 只读，不处理
        }
      });
      
      // 添加当前时间标记
      this.addCurrentTimeMarker();
    },
    addCurrentTimeMarker() {
      // 由于frappe-gantt不直接支持当前时间线，我们通过DOM操作添加
      setTimeout(() => {
        const ganttContainer = this.$refs.gantt;
        if (!ganttContainer) return;
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01`;
        
        // 查找对应日期的列
        const columns = ganttContainer.querySelectorAll('.gantt-chart .grid-row .grid-cell');
        const headerCells = ganttContainer.querySelectorAll('.gantt-chart .grid-header .grid-row .grid-cell');
        
        // 遍历头部单元格查找当前月份
        let currentMonthIndex = -1;
        headerCells.forEach((cell, index) => {
          if (cell.innerText.indexOf(now.getFullYear().toString()) >= 0 && 
              cell.innerText.indexOf((now.getMonth() + 1).toString().padStart(2, '0')) >= 0) {
            currentMonthIndex = index;
          }
        });
        
        // 如果找到了当前月份，添加标记
        if (currentMonthIndex >= 0) {
          const currentColumn = columns[currentMonthIndex];
          if (currentColumn) {
            const marker = document.createElement('div');
            marker.className = 'current-time-marker';
            marker.style.position = 'absolute';
            marker.style.top = '0';
            marker.style.left = `${currentColumn.offsetLeft + currentColumn.offsetWidth / 2}px`;
            marker.style.height = '100%';
            marker.style.width = '2px';
            marker.style.backgroundColor = 'red';
            marker.style.zIndex = '100';
            
            ganttContainer.querySelector('.gantt-container').appendChild(marker);
          }
        }
      }, 500);
    },
    updateViewMode() {
      if (this.ganttChart) {
        this.ganttChart.change_view_mode(this.viewMode);
        this.addCurrentTimeMarker();
      }
    },
    getProgressClass(progress) {
      if (progress >= 100) {
        return 'completed';
      } else if (progress >= 60) {
        return 'high-progress';
      } else if (progress >= 30) {
        return 'medium-progress';
      } else {
        return 'low-progress';
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
    handleGanttItemClick(task) {
      const project = this.projectsData.find(p => p.id === task.id);
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

.gantt-controls {
  margin-bottom: 10px;
  text-align: left;
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

/* 甘特图进度条样式 */
.frappe-gantt .bar.completed .bar-progress {
  fill: #67C23A;
}

.frappe-gantt .bar.high-progress .bar-progress {
  fill: #409EFF;
}

.frappe-gantt .bar.medium-progress .bar-progress {
  fill: #E6A23C;
}

.frappe-gantt .bar.low-progress .bar-progress {
  fill: #F56C6C;
}

.frappe-gantt .bar .handle {
  display: none;  /* 隐藏拖动调整的控件 */
}

/* 当前时间标记样式 */
.current-time-marker {
  position: absolute;
  z-index: 100;
  pointer-events: none;
}
</style> 