<template>
  <div class="gantt-demo">
    <h2>ElementUI 自定义实现</h2>
    
    <div class="custom-gantt">
      <!-- 左侧固定表格 -->
      <div class="gantt-table-container">
        <el-table
          :data="projectsData"
          style="width: 100%"
          height="100%">
          <el-table-column
            prop="name"
            label="项目名称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="manager"
            label="负责人"
            width="100">
          </el-table-column>
          <el-table-column
            prop="priority"
            label="优先级"
            width="80">
            <template slot-scope="scope">
              <el-tag :type="getPriorityType(scope.row.priority)">{{ scope.row.priority }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="progress"
            label="进度"
            width="150">
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.progress" :status="getProgressStatus(scope.row.progress)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
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
      
      <!-- 右侧甘特图部分 -->
      <div class="gantt-chart-container">
        <!-- 甘特图头部（年月标题） -->
        <div class="gantt-header">
          <!-- 年份行 - 放在顶部 -->
          <div class="year-row">
            <div 
              v-for="yearHeader in yearHeaders" 
              :key="yearHeader.year"
              class="year-cell"
              :style="{ width: `${yearHeader.months * cellWidth}px` }">
              {{ yearHeader.year }}年
            </div>
          </div>
          <!-- 月份行 - 放在年份行下方 -->
          <div class="month-row">
            <div 
              v-for="(month, index) in monthHeaders" 
              :key="index"
              class="month-cell"
              :class="{ 
                'current-month': month.isCurrent,
                'year-boundary-left': month.month === 1 && index > 0
              }"
              :style="{ width: `${cellWidth}px` }">
              {{ month.month }}月
            </div>
          </div>
        </div>
        
        <!-- 甘特图内容 -->
        <div class="gantt-body">
          <!-- 当前月份指示线 -->
          <div class="current-month-indicator" :style="{ left: `${currentMonthPosition}px` }"></div>
          
          <!-- 项目进度条 -->
          <div 
            v-for="(project, index) in projectsData" 
            :key="project.id"
            class="gantt-row"
            :style="{ height: `${rowHeight}px` }">
            <!-- 背景网格 -->
            <div class="grid-row">
              <div 
                v-for="(month, monthIndex) in monthHeaders" 
                :key="monthIndex"
                class="grid-cell"
                :class="{ 
                  'current-month': month.isCurrent,
                  'year-boundary-left': month.month === 1 && monthIndex > 0
                }"
                :style="{ width: `${cellWidth}px` }">
              </div>
            </div>
            
            <!-- 项目进度条 -->
            <div 
              class="gantt-bar" 
              :style="{
                left: `${getBarLeftPosition(project)}px`,
                width: `${getBarWidth(project)}px`,
                backgroundColor: getBarColor(project.progress)
              }"
              @click="handleDetail(project)">
              <div 
                class="progress-indicator" 
                :style="{ width: `${project.progress}%` }">
              </div>
              <span class="bar-label">{{ project.name }} ({{ project.progress }}%)</span>
            </div>
          </div>
        </div>
      </div>
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

export default {
  name: 'CustomGanttDemo',
  data() {
    return {
      projectsData: [],
      yearHeaders: [],
      monthHeaders: [],
      cellWidth: 80,
      rowHeight: 50,
      startYearMonth: '',
      endYearMonth: '',
      currentYearMonth: getCurrentYearMonth(),
      currentMonthPosition: 0,
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
        const startDate = new Date(`${project.startDate}-01`);
        const endDate = new Date(`${project.endDate}-01`);
        
        if (startDate < minDate) {
          minDate = startDate;
        }
        
        if (endDate > maxDate) {
          maxDate = endDate;
        }
      });
      
      // 设置开始和结束年月 - 确保从年初开始，到年末结束
      this.startYearMonth = `${minDate.getFullYear()}-01`;
      
      // 结束日期加一个月确保显示完整，并调整到年末
      const endYear = maxDate.getFullYear();
      this.endYearMonth = `${endYear}-12`;
      
      // 生成年份和月份标题
      this.generateHeaders();
      
      // 计算当前月份位置
      this.calculateCurrentMonthPosition();
    },
    generateHeaders() {
      const startParts = this.startYearMonth.split('-');
      const endParts = this.endYearMonth.split('-');
      
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]);
      const endYear = parseInt(endParts[0]);
      const endMonth = parseInt(endParts[1]);
      
      // 生成年份标题
      const yearHeaders = [];
      for (let year = startYear; year <= endYear; year++) {
        // 计算本年显示几个月
        const startM = year === startYear ? startMonth : 1;
        const endM = year === endYear ? endMonth : 12;
        const months = endM - startM + 1;
        
        yearHeaders.push({
          year,
          months,
          startMonth: startM,
          endMonth: endM
        });
      }
      this.yearHeaders = yearHeaders;
      
      // 生成月份标题
      const monthHeaders = [];
      const currentParts = this.currentYearMonth.split('-');
      const currentYear = parseInt(currentParts[0]);
      const currentMonth = parseInt(currentParts[1]);
      
      // 遍历每一年的每个月份
      yearHeaders.forEach(yearHeader => {
        for (let month = yearHeader.startMonth; month <= yearHeader.endMonth; month++) {
          monthHeaders.push({
            year: yearHeader.year,
            month,
            isCurrent: yearHeader.year === currentYear && month === currentMonth,
            isYearStart: month === 1 && yearHeader.year > startYear
          });
        }
      });
      
      this.monthHeaders = monthHeaders;
    },
    calculateCurrentMonthPosition() {
      const currentParts = this.currentYearMonth.split('-');
      const currentYear = parseInt(currentParts[0]);
      const currentMonth = parseInt(currentParts[1]);
      
      let position = 0;
      let found = false;
      
      for (let i = 0; i < this.monthHeaders.length; i++) {
        const header = this.monthHeaders[i];
        
        if (header.year === currentYear && header.month === currentMonth) {
          found = true;
          position = i * this.cellWidth + this.cellWidth / 2;
          break;
        }
      }
      
      this.currentMonthPosition = found ? position : 0;
    },
    getBarLeftPosition(project) {
      const startParts = project.startDate.split('-');
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]);
      
      let position = 0;
      
      for (let i = 0; i < this.monthHeaders.length; i++) {
        const header = this.monthHeaders[i];
        
        if (header.year === startYear && header.month === startMonth) {
          position = i * this.cellWidth;
          break;
        }
      }
      
      return position;
    },
    getBarWidth(project) {
      const startParts = project.startDate.split('-');
      const endParts = project.endDate.split('-');
      
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]);
      const endYear = parseInt(endParts[0]);
      const endMonth = parseInt(endParts[1]);
      
      // 计算跨越的月份数
      const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
      
      return months * this.cellWidth;
    },
    getBarColor(progress) {
      // 根据进度设置不同的颜色
      return progress < 30 ? '#F56C6C' : 
             progress < 60 ? '#E6A23C' : 
             progress < 100 ? '#409EFF' : 
             '#67C23A';
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

h2 {
  text-align: left;
  margin: 10px 0 20px;
  color: #303133;
}

.custom-gantt {
  display: flex;
  flex: 1;
  height: calc(100vh - 200px);
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
}

.gantt-table-container {
  flex: 0 0 auto;
  width: 680px; /* 等于所有固定列的宽度总和 */
  overflow: hidden;
  border-right: 2px solid #DCDFE6;
  z-index: 2; /* 确保表格在滚动时位于甘特图上层 */
}

.gantt-chart-container {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #FAFAFA;
}

.gantt-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f7fa;
  border-bottom: 1px solid #DCDFE6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* 确保年份行在上，月份行在下 */
}

.year-row {
  display: flex;
  height: 30px;
  border-bottom: 1px solid #EBEEF5;
  background-color: #f2f6fc;
  width: max-content; /* 确保能容纳所有年份 */
}

.year-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-right: 1px solid #EBEEF5;
  position: relative;
}

/* 添加年份之间的分隔线样式 */
.year-cell:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #DCDFE6;
}

.month-row {
  display: flex;
  height: 30px;
  background-color: #f5f7fa;
  width: max-content; /* 确保能容纳所有月份 */
}

.month-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #EBEEF5;
  position: relative;
}

/* 年份交界处的月份单元格添加明显的分隔 */
.month-cell.year-boundary-left {
  border-left: 2px solid #DCDFE6;
}

.month-cell.current-month {
  background-color: rgba(64, 158, 255, 0.15);
  font-weight: bold;
}

.gantt-body {
  flex: 1;
  position: relative;
  overflow: visible;
  min-height: 300px;
}

.gantt-row {
  position: relative;
  border-bottom: 1px solid #EBEEF5;
  transition: background-color 0.2s;
}

.gantt-row:hover {
  background-color: rgba(64, 158, 255, 0.05);
}

.grid-row {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.grid-cell {
  height: 100%;
  border-right: 1px solid #EBEEF5;
}

/* 当前月份的网格背景色 */
.grid-cell.current-month {
  background-color: rgba(64, 158, 255, 0.05);
  position: relative;
}

/* 年份边界的网格线 */
.grid-cell.year-boundary-left {
  border-left: 2px solid #DCDFE6;
}

.gantt-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 26px;
  border-radius: 4px;
  z-index: 2;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gantt-bar:hover {
  transform: translateY(-50%) translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.progress-indicator {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: inherit;
  position: relative;
}

.progress-indicator::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.bar-label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  white-space: nowrap;
  padding: 0 5px;
  z-index: 3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.current-month-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #F56C6C;
  z-index: 5;
  pointer-events: none;
  box-shadow: 0 0 5px rgba(245, 108, 108, 0.5);
}

/* 响应式设计优化 */
@media screen and (max-width: 1200px) {
  .gantt-table-container {
    width: 500px;
  }
  .custom-gantt {
    height: calc(100vh - 180px);
  }
}

@media screen and (max-width: 768px) {
  .gantt-table-container {
    width: 300px;
  }
  .custom-gantt {
    height: calc(100vh - 160px);
    flex-direction: column;
  }
  .gantt-table-container {
    width: 100%;
    height: auto;
    max-height: 300px;
    border-right: none;
    border-bottom: 2px solid #DCDFE6;
  }
}
</style> 