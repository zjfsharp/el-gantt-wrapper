<template>
  <div class="gantt-demo">
    <div class="custom-gantt">
      <!-- 左侧固定表格 -->
      <div class="gantt-table-container">
        <el-table
          ref="ganttTable"
          :data="projectsData"
          style="width: 100%"
          height="100%"
          :header-row-class-name="'gantt-table-header'"
          :row-class-name="'gantt-table-row'"
          :row-height="rowHeight">
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
      <div class="gantt-chart-container" ref="ganttChartContainer" @scroll="handleGanttScroll">
        <!-- 甘特图头部（年月标题） -->
        <div class="gantt-header">
          <!-- 年份行 -->
          <div class="year-row">
            <div 
              v-for="yearHeader in yearHeaders" 
              :key="yearHeader.year"
              class="year-cell"
              :style="{ width: `${yearHeader.width}px` }">
              {{ yearHeader.year }}年
            </div>
          </div>
          <!-- 月份行 -->
          <div class="month-row">
            <div 
              v-for="(month, index) in monthHeaders" 
              :key="index"
              class="month-cell"
              :class="{ 
                'current-month': month.isCurrent,
                'year-boundary-left': month.month === 1 && index > 0
              }"
              :style="{ width: `${month.width}px` }">
              {{ month.month }}月
            </div>
          </div>
        </div>
        
        <!-- 甘特图内容 -->
        <div class="gantt-body" ref="ganttBody">
          <!-- 水平网格线 -->
          <div class="horizontal-grid-lines">
            <!-- 第一条线在顶部 -->
            <div 
              class="horizontal-grid-line"
              :style="{ 
                top: `0px`,
                width: `${getTotalWidth()}px` 
              }">
            </div>
            <!-- 每行下面的线 -->
            <div 
              v-for="(project, index) in projectsData" 
              :key="`hgrid-${index}`"
              class="horizontal-grid-line"
              :style="{ 
                top: `${(index + 1) * rowHeight}px`,
                width: `${getTotalWidth()}px` 
              }">
            </div>
          </div>
          
          <!-- 月份分隔线 -->
          <div class="month-grid-lines">
            <div 
              v-for="(month, monthIndex) in monthHeaders" 
              :key="monthIndex"
              class="month-grid-line"
              :class="{ 
                'current-month': month.isCurrent,
                'year-boundary': month.month === 1 && monthIndex > 0
              }"
              :style="{ 
                left: `${getMonthPosition(monthIndex)}px`,
                height: `${projectsData.length * rowHeight}px`
              }">
            </div>
            <!-- 最后一个月的右边界 -->
            <div 
              class="month-grid-line"
              :style="{ 
                left: `${getTotalWidth()}px`,
                height: `${projectsData.length * rowHeight}px`
              }">
            </div>
          </div>
          
          <!-- 当前月份高亮区域 -->
          <div 
            v-if="isCurrentMonthVisible"
            class="current-month-highlight"
            :style="{ 
              left: `${getMonthPosition(getCurrentMonthIndex())}px`,
              width: `${monthHeaders[getCurrentMonthIndex()].width}px`,
              height: `${projectsData.length * rowHeight}px`
            }">
          </div>
          
          <!-- 当前月份指示线 -->
          <div 
            v-if="isCurrentMonthVisible"
            class="current-month-indicator" 
            :style="{ 
              left: `${currentMonthPosition}px`,
              height: `${projectsData.length * rowHeight}px`
            }">
            <!-- 当前日期标签容器 -->
            <div class="current-date-label-container">
              <div class="current-date-label">{{ getCurrentDateText() }}</div>
            </div>
          </div>
          
          <!-- 项目进度条 -->
          <div 
            v-for="(project, index) in projectsData" 
            :key="project.id"
            class="gantt-row"
            :style="{ 
              height: `${rowHeight}px`, 
              top: `${index * rowHeight}px`,
              boxSizing: 'border-box' 
            }">
            <!-- 项目进度条 -->
            <div 
              class="gantt-bar" 
              :style="{
                left: `${getBarLeftPosition(project)}px`,
                width: `${getBarWidth(project)}px`,
                backgroundColor: getBarBackgroundColor(project.progress)
              }"
              @click="handleDetail(project)">
              <div 
                class="progress-indicator" 
                :style="{ 
                  width: `${project.progress}%`,
                  backgroundColor: getBarColor(project.progress)
                }">
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
  name: 'CustomGanttDemoFixed',
  props: {
    cellWidth: {
      type: Number,
      default: 50,
      description: '月份单元格的宽度，影响甘特图的水平比例'
    },
    rowHeight: {
      type: Number,
      default: 60,
      description: '行高，决定每个项目条目的高度'
    },
    headerHeight: {
      type: Number,
      default: 72,
      description: '头部高度，包含年份行和月份行的高度总和'
    }
  },
  data() {
    return {
      projectsData: [],
      yearHeaders: [],
      monthHeaders: [],
      startYearMonth: '',
      endYearMonth: '',
      currentYearMonth: getCurrentYearMonth(),
      currentMonthPosition: 0,
      dialogVisible: false,
      currentProject: null,
      isScrolling: false, // 防止滚动事件循环触发
      resizeTimeout: null, // 用于防抖处理窗口大小变化
      scrollAdjustTimeout: null, // 用于滚动事件处理的防抖
      scrollTimeout: null, // 用于滚动事件处理的防抖
      isUpdatingLines: false, // 防止重复更新网格线
      isCurrentMonthVisible: false, // 当前月份是否在显示范围内
    };
  },
  created() {
    this.initData();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', this.handleWindowResize);
  },
  mounted() {
    this.$nextTick(() => {
      // 确保所有DOM元素完全渲染后再进行初始化操作
      setTimeout(() => {
        // 先调整表格高度和行高，确保表格和甘特图初始大小一致
        this.adjustTableHeaderHeight();
        
        // 隐藏表格滚动条
        this.hideTableScrollbars();
        
        // 初始化时标准化网格线宽度/高度
        this.initializeGridLines();
        
        // 初始化滚动同步 - 在所有尺寸调整之后
        this.initScrollSync();
        
        // 恢复滚动到当前月份，但不使用动画
        this.scrollToCurrentMonth();
        
        // 添加滚动监听，修改为只用于检查边缘位置
        const ganttContainer = this.$refs.ganttChartContainer;
        if (ganttContainer) {
          ganttContainer.addEventListener('scroll', this.onGanttScroll, { passive: true });
        }
        
        // 再次进行最终调整以确保完全对齐
        this.finalAdjustment();
      }, 100); // 100ms延迟确保DOM完全渲染
    });
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听器
    window.removeEventListener('resize', this.handleWindowResize);
    
    const ganttContainer = this.$refs.ganttChartContainer;
    if (ganttContainer) {
      ganttContainer.removeEventListener('scroll', this.onGanttScroll);
    }
  },
  methods: {
    hideTableScrollbars() {
      // 获取表格体的滚动容器
      const tableBodyWrapper = this.$refs.ganttTable.$el.querySelector('.el-table__body-wrapper');
      if (tableBodyWrapper) {
        // 隐藏表格的滚动条
        tableBodyWrapper.style.overflowY = 'hidden';
        tableBodyWrapper.style.overflowX = 'hidden';
        
        // 添加垂直滚动同步
        this.initScrollSync();
      }
    },
    
    handleGanttScroll(e) {
      // 使用节流而不是防抖，确保滚动时的平滑性
      if (this.isScrolling) return;
      
      this.isScrolling = true;
      
      // 获取甘特图滚动容器的滚动位置
      const ganttContainer = this.$refs.ganttChartContainer;
      const scrollTop = ganttContainer.scrollTop;
      
      // 获取表格体的滚动容器
      const tableBodyWrapper = this.$refs.ganttTable.$el.querySelector('.el-table__body-wrapper');
      if (tableBodyWrapper) {
        // 直接设置滚动位置，不使用动画，确保精确对齐
        tableBodyWrapper.scrollTop = scrollTop;
      }
      
      // 允许下一次滚动事件在2ms后生效
      setTimeout(() => {
        this.isScrolling = false;
      }, 2);
    },
    
    adjustTableHeaderHeight() {
      // 调整表格头部高度
      const headerEl = this.$refs.ganttTable.$el.querySelector('.el-table__header-wrapper');
      if (headerEl) {
        // 设置精确的头部高度，确保与甘特图头部完全匹配
        headerEl.style.height = `${this.headerHeight}px`;
        headerEl.style.boxSizing = 'border-box'; // 确保边框计入高度计算
        
        // 调整表头行高
        const headerRow = headerEl.querySelector('tr');
        if (headerRow) {
          headerRow.style.height = `${this.headerHeight}px`;
          headerRow.style.boxSizing = 'border-box'; // 确保边框计入高度计算
        }
        
        // 调整表头单元格行高
        const headerCells = headerRow ? headerRow.querySelectorAll('th') : [];
        headerCells.forEach(cell => {
          cell.style.height = `${this.headerHeight}px`;
          cell.style.boxSizing = 'border-box'; // 确保边框计入高度计算
          const cellInner = cell.querySelector('.cell');
          if (cellInner) {
            cellInner.style.height = `${this.headerHeight}px`;
            cellInner.style.lineHeight = `${this.headerHeight}px`;
            cellInner.style.boxSizing = 'border-box'; // 确保边框计入高度计算
          }
        });
      }
      
      // 调整表格体行高
      const bodyEl = this.$refs.ganttTable.$el.querySelector('.el-table__body-wrapper');
      if (bodyEl) {
        const rows = bodyEl.querySelectorAll('tr');
        rows.forEach(row => {
          row.style.height = `${this.rowHeight}px`;
          row.style.boxSizing = 'border-box'; // 确保边框计入高度计算
          
          const cells = row.querySelectorAll('td');
          cells.forEach(cell => {
            cell.style.height = `${this.rowHeight}px`;
            cell.style.boxSizing = 'border-box'; // 确保边框计入高度计算
            const cellInner = cell.querySelector('.cell');
            if (cellInner) {
              cellInner.style.height = `${this.rowHeight}px`;
              cellInner.style.boxSizing = 'border-box'; // 确保边框计入高度计算
              cellInner.style.lineHeight = 'normal';
              cellInner.style.display = 'flex';
              cellInner.style.alignItems = 'center';
              cellInner.style.justifyContent = 'center';
            }
          });
        });
      }
      
      // 隐藏表格滚动条
      this.hideTableScrollbars();
    },
    
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
      
      // 设置开始和结束年月，使用实际数据中的最早月份和最晚月份
      const startYear = minDate.getFullYear();
      const startMonth = minDate.getMonth() + 1; // getMonth()返回0-11，需要+1
      this.startYearMonth = `${startYear}-${startMonth.toString().padStart(2, '0')}`;
      
      const endYear = maxDate.getFullYear();
      const endMonth = maxDate.getMonth() + 1;
      this.endYearMonth = `${endYear}-${endMonth.toString().padStart(2, '0')}`;
      
      console.log(`甘特图显示范围：${this.startYearMonth} 到 ${this.endYearMonth}`);
      
      // 生成年份和月份标题
      this.generateHeaders();
      
      // 计算当前月份位置
      this.calculateCurrentMonthPosition();
      
      // 更新当前月份可见性
      this.updateCurrentMonthVisibility();
      
      // 在渲染完成后调整表格高度并滚动到当前月份
      this.$nextTick(() => {
        this.adjustTableHeaderHeight();
        this.hideTableScrollbars();
        
        // 更新网格线尺寸
        this.updateGridLines();
        
        // 恢复滚动到当前月份
        this.scrollToCurrentMonth();
      });
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
        // 计算本年显示几个月 - 根据实际范围
        const startM = year === startYear ? startMonth : 1;
        const endM = year === endYear ? endMonth : 12;
        const months = endM - startM + 1;
        
        // 精确计算年份宽度，考虑边框宽度
        const yearWidth = months * this.cellWidth;
        
        yearHeaders.push({
          year,
          months,
          startMonth: startM,
          endMonth: endM,
          width: yearWidth // 计算年份单元格的宽度
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
        // 为每一年创建月份组
        const yearMonths = [];
        const monthCount = yearHeader.months;
        
        for (let i = 0; i < monthCount; i++) {
          const month = yearHeader.startMonth + i;
          // 精确计算每个月份宽度
          const isLastMonthOfYear = month === yearHeader.endMonth && yearHeader.year < endYear;
          // 如果是年份的最后一个月且不是整个时间段的最后一年，减去1px边框宽度
          const monthWidth = isLastMonthOfYear ? 
                          (yearHeader.width / monthCount) - 1 : 
                          (yearHeader.width / monthCount);
                          
          yearMonths.push({
            year: yearHeader.year,
            month,
            isCurrent: yearHeader.year === currentYear && month === currentMonth,
            isYearStart: month === 1 && yearHeader.year > startYear,
            isYearEnd: month === 12 && yearHeader.year < endYear,
            width: monthWidth
          });
        }
        
        // 将该年的月份添加到总月份列表
        monthHeaders.push(...yearMonths);
      });
      
      this.monthHeaders = monthHeaders;
    },
    getMonthPosition(monthIndex) {
      if (monthIndex < 0 || monthIndex >= this.monthHeaders.length) {
        return 0;
      }
      let position = 0;
      for (let i = 0; i < monthIndex; i++) {
        position += this.monthHeaders[i].width;
      }
      return position;
    },
    getTotalWidth() {
      let width = 0;
      for (let i = 0; i < this.monthHeaders.length; i++) {
        width += this.monthHeaders[i].width;
      }
      return width;
    },
    getCurrentMonthIndex() {
      const currentParts = this.currentYearMonth.split('-');
      const currentYear = parseInt(currentParts[0]);
      const currentMonth = parseInt(currentParts[1]);
      
      // 检查当前月份是否在显示范围内
      const startParts = this.startYearMonth.split('-');
      const endParts = this.endYearMonth.split('-');
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]);
      const endYear = parseInt(endParts[0]);
      const endMonth = parseInt(endParts[1]);
      
      // 如果当前月份在范围之外，返回最接近的月份索引
      if (currentYear < startYear || (currentYear === startYear && currentMonth < startMonth)) {
        // 当前月份早于起始月份，返回第一个月份
        return 0;
      }
      
      if (currentYear > endYear || (currentYear === endYear && currentMonth > endMonth)) {
        // 当前月份晚于结束月份，返回最后一个月份
        return this.monthHeaders.length - 1;
      }
      
      // 正常情况，查找当前月份的索引
      for (let i = 0; i < this.monthHeaders.length; i++) {
        const header = this.monthHeaders[i];
        if (header.year === currentYear && header.month === currentMonth) {
          return i;
        }
      }
      
      // 如果找不到精确匹配（这种情况不应该发生），返回-1
      return -1;
    },
    calculateCurrentMonthPosition() {
      const index = this.getCurrentMonthIndex();
      if (index >= 0) {
        // 获取当前月份的宽度
        const width = this.monthHeaders[index].width;
        // 计算当前月份中点位置
        this.currentMonthPosition = this.getMonthPosition(index) + width / 2;
        console.log(`当前月份位置：${this.currentMonthPosition}px，索引：${index}`);
      } else {
        // 如果找不到当前月份，默认使用甘特图的中间位置
        this.currentMonthPosition = this.getTotalWidth() / 2;
        console.log(`未找到当前月份，使用中间位置：${this.currentMonthPosition}px`);
      }
    },
    getBarLeftPosition(project) {
      const startParts = project.startDate.split('-');
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]);
      
      // 检查项目起始日期是否早于甘特图起始日期
      const chartStartParts = this.startYearMonth.split('-');
      const chartStartYear = parseInt(chartStartParts[0]);
      const chartStartMonth = parseInt(chartStartParts[1]);
      
      // 如果项目开始日期早于甘特图开始日期，将项目的开始位置设为甘特图开始位置
      if (startYear < chartStartYear || (startYear === chartStartYear && startMonth < chartStartMonth)) {
        return 0; // 从甘特图开始位置开始
      }
      
      let position = 0;
      let found = false;
      
      // 遍历月份头找到对应的位置
      for (let i = 0; i < this.monthHeaders.length; i++) {
        const header = this.monthHeaders[i];
        
        if (header.year === startYear && header.month === startMonth) {
          // 找到了对应的月份
          found = true;
          position = this.getMonthPosition(i); // 使用通用方法获取位置
          break;
        }
      }
      
      return found ? position : 0;
    },
    getBarWidth(project) {
      const startParts = project.startDate.split('-');
      const endParts = project.endDate.split('-');
      
      let startYear = parseInt(startParts[0]);
      let startMonth = parseInt(startParts[1]);
      let endYear = parseInt(endParts[0]);
      let endMonth = parseInt(endParts[1]);
      
      // 检查项目日期是否超出甘特图范围，并调整为甘特图范围内
      const chartStartParts = this.startYearMonth.split('-');
      const chartEndParts = this.endYearMonth.split('-');
      const chartStartYear = parseInt(chartStartParts[0]);
      const chartStartMonth = parseInt(chartStartParts[1]);
      const chartEndYear = parseInt(chartEndParts[0]);
      const chartEndMonth = parseInt(chartEndParts[1]);
      
      // 如果项目开始日期早于甘特图开始日期，调整为甘特图开始日期
      if (startYear < chartStartYear || (startYear === chartStartYear && startMonth < chartStartMonth)) {
        startYear = chartStartYear;
        startMonth = chartStartMonth;
      }
      
      // 如果项目结束日期晚于甘特图结束日期，调整为甘特图结束日期
      if (endYear > chartEndYear || (endYear === chartEndYear && endMonth > chartEndMonth)) {
        endYear = chartEndYear;
        endMonth = chartEndMonth;
      }
      
      let startIdx = -1;
      let endIdx = -1;
      
      // 找到开始和结束月份的索引
      for (let i = 0; i < this.monthHeaders.length; i++) {
        const header = this.monthHeaders[i];
        
        if (header.year === startYear && header.month === startMonth) {
          startIdx = i;
        }
        
        if (header.year === endYear && header.month === endMonth) {
          endIdx = i;
          break; // 找到结束月份后就可以停止遍历
        }
      }
      
      // 如果找到了开始和结束月份
      if (startIdx !== -1 && endIdx !== -1) {
        let width = 0;
        
        // 累加从开始到结束月份的宽度
        for (let i = startIdx; i <= endIdx; i++) {
          width += this.monthHeaders[i].width;
        }
        
        return width;
      }
      
      // 如果没找到，使用默认宽度
      return this.cellWidth;
    },
    getBarColor(progress) {
      // 根据进度设置不同的颜色 - 这里返回实际进度的颜色，应当清晰明亮
      return progress < 30 ? '#F56C6C' : // 红色 - 低进度
             progress < 60 ? '#E6A23C' : // 橙色 - 中进度
             progress < 100 ? '#409EFF' : // 蓝色 - 高进度
             '#67C23A'; // 绿色 - 已完成
    },
    getBarBackgroundColor(progress) {
      // 返回进度条背景的浅色版本，作为总长度的背景色
      return progress < 30 ? 'rgba(245, 108, 108, 0.2)' : // 浅红色
             progress < 60 ? 'rgba(230, 162, 60, 0.2)' : // 浅橙色
             progress < 100 ? 'rgba(64, 158, 255, 0.2)' : // 浅蓝色
             'rgba(103, 194, 58, 0.2)'; // 浅绿色
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
    // 获取当前日期的格式化文本
    getCurrentDateText() {
      const now = new Date();
      const month = now.getMonth() + 1; // 月份是从0开始的，所以需要+1
      const day = now.getDate();
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const weekDay = weekDays[now.getDay()];
      return `${month}月${day}日 (周${weekDay})`;
    },
    // 处理窗口大小变化
    handleWindowResize() {
      // 使用防抖，避免频繁调用
      if (this.resizeTimeout) {
        cancelAnimationFrame(this.resizeTimeout);
      }
      
      this.resizeTimeout = requestAnimationFrame(() => {
        // 重新计算年份和月份标题布局
        this.recalculateHeaderLayout();
        
        // 重新调整表格头部高度
        this.adjustTableHeaderHeight();
        
        // 更新网格线尺寸
        this.updateGridLines();
        
        // 最终调整确保对齐
        this.finalAdjustment();
      });
    },
    
    // 重新计算头部布局
    recalculateHeaderLayout() {
      // 重新计算年份和月份的宽度
      this.generateHeaders();
      
      // 重新计算当前月份位置
      this.calculateCurrentMonthPosition();
    },
    
    // 重置网格线样式
    resetGridLines() {
      const ganttBody = this.$refs.ganttBody;
      if (!ganttBody) return;
      
      // 使用classList修改而不是直接设置style属性，提高性能
      ganttBody.classList.add('resetting-grid-lines');
      
      // 使用setTimeout使浏览器有时间应用类样式变更
      setTimeout(() => {
        ganttBody.classList.remove('resetting-grid-lines');
      }, 0);
    },
    
    // 滚动事件处理的防抖
    onGanttScroll: function() {
      if (this.scrollTimeout) {
        cancelAnimationFrame(this.scrollTimeout);
      }
      
      this.scrollTimeout = requestAnimationFrame(() => {
        const ganttContainer = this.$refs.ganttChartContainer;
        if (ganttContainer) {
          // 检查是否需要刷新网格线（当滚动到边缘时）
          const viewportWidth = ganttContainer.clientWidth;
          const totalWidth = this.getTotalWidth();
          const scrollLeft = ganttContainer.scrollLeft;
          
          // 如果已经滚动到右侧80%以上，确保网格线宽度足够
          if (scrollLeft + viewportWidth > totalWidth * 0.8) {
            this.ensureGridLinesDisplay();
          }
        }
      });
    },
    // 确保网格线显示正常
    ensureGridLinesDisplay() {
      // 不触发完整的更新，只确保网格线显示
      const ganttContainer = this.$refs.ganttChartContainer;
      if (!ganttContainer) return;
      
      const ganttBody = this.$refs.ganttBody;
      if (!ganttBody) return;
      
      // 检查是否有网格线已不再可见（宽度或高度不足）
      const horizontalLines = ganttBody.querySelectorAll('.horizontal-grid-line');
      const totalWidth = this.getTotalWidth();
      
      // 只对第一条线进行检查，如果宽度不足则更新所有线条
      if (horizontalLines.length > 0) {
        const firstLine = horizontalLines[0];
        const lineWidth = parseFloat(getComputedStyle(firstLine).width);
        
        if (lineWidth < totalWidth * 0.9) {
          // 如果网格线宽度不足，重新设置所有网格线
          this.updateGridLines();
        }
      }
    },
    // 高性能表格滚动同步
    syncTableScroll() {
      // 获取表格体的滚动容器
      const tableBodyWrapper = this.$refs.ganttTable.$el.querySelector('.el-table__body-wrapper');
      if (!tableBodyWrapper) return;
      
      // 给表格体添加滚动事件监听器
      tableBodyWrapper.addEventListener('scroll', (e) => {
        // 使用节流而不是防抖，确保滚动时的平滑性
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        
        // 获取表格滚动位置
        const scrollTop = tableBodyWrapper.scrollTop;
        
        // 同步甘特图的垂直滚动位置
        const ganttContainer = this.$refs.ganttChartContainer;
        if (ganttContainer) {
          // 直接设置滚动位置，不使用动画，确保精确对齐
          ganttContainer.scrollTop = scrollTop;
        }
        
        // 允许下一次滚动事件在2ms后生效
        setTimeout(() => {
          this.isScrolling = false;
        }, 2);
      }, { passive: true });
    },
    // 初始化双向滚动同步
    initScrollSync() {
      this.$nextTick(() => {
        this.syncTableScroll();
      });
    },
    // 获取总高度（实际项目高度）
    getTotalHeight() {
      return this.projectsData.length * this.rowHeight;
    },
    
    // 获取总宽度（实际甘特图宽度）
    getTotalWidthWithSafety() {
      return this.getTotalWidth();
    },

    // 初始化网格线
    initializeGridLines() {
      const ganttContainer = this.$refs.ganttChartContainer;
      if (!ganttContainer) return;
      
      // 设置网格线的初始宽度和高度
      this.updateGridLines();
    },
    
    // 更新网格线尺寸
    updateGridLines() {
      if (this.isUpdatingLines) return;
      
      this.isUpdatingLines = true;
      
      const ganttContainer = this.$refs.ganttChartContainer;
      if (!ganttContainer) {
        this.isUpdatingLines = false;
        return;
      }
      
      // 使用requestAnimationFrame优化性能
      requestAnimationFrame(() => {
        // 重置所有网格线样式
        this.resetGridLines();
        
        // 计算总内容宽度和高度
        const totalWidth = this.getTotalWidth();
        const totalHeight = this.projectsData.length * this.rowHeight;
        
        // 批量更新DOM，减少重排和重绘
        // 更新水平网格线宽度
        const horizontalLines = ganttContainer.querySelectorAll('.horizontal-grid-line');
        horizontalLines.forEach(line => {
          line.style.width = `${totalWidth}px`;
        });
        
        // 更新垂直网格线高度
        const verticalLines = ganttContainer.querySelectorAll('.month-grid-line');
        verticalLines.forEach(line => {
          line.style.height = `${totalHeight}px`;
        });
        
        // 更新当前月份指示线高度
        const currentMonthIndicator = ganttContainer.querySelector('.current-month-indicator');
        if (currentMonthIndicator) {
          currentMonthIndicator.style.height = `${totalHeight}px`;
        }
        
        // 更新当前月份高亮区域高度
        const currentMonthHighlight = ganttContainer.querySelector('.current-month-highlight');
        if (currentMonthHighlight) {
          currentMonthHighlight.style.height = `${totalHeight}px`;
        }
        
        // 确保行对齐 - 检查和更新每一行元素的位置和高度
        const ganttRows = ganttContainer.querySelectorAll('.gantt-row');
        ganttRows.forEach((row, index) => {
          row.style.top = `${index * this.rowHeight}px`;
          row.style.height = `${this.rowHeight}px`;
          row.style.boxSizing = 'border-box';
        });
        
        this.isUpdatingLines = false;
      });
    },
    // 添加scrollToCurrentMonth方法，但不使用动画
    scrollToCurrentMonth() {
      // 获取甘特图容器
      const ganttContainer = this.$refs.ganttChartContainer;
      if (!ganttContainer) return;
      
      // 获取当前月份索引
      const currentMonthIndex = this.getCurrentMonthIndex();
      if (currentMonthIndex < 0) return;
      
      // 获取当前月份的位置
      const currentMonthPos = this.getMonthPosition(currentMonthIndex);
      
      // 获取甘特图容器的宽度
      const containerWidth = ganttContainer.clientWidth;
      
      // 计算滚动位置，让当前月份显示在视图中间
      const scrollLeft = Math.max(0, currentMonthPos - (containerWidth / 2) + (this.monthHeaders[currentMonthIndex].width / 2));
      
      // 直接设置滚动位置，不使用动画
      ganttContainer.scrollLeft = scrollLeft;
      
      // 记录日志
      console.log(`滚动到当前月份位置：${this.currentYearMonth}，索引：${currentMonthIndex}，位置：${currentMonthPos}px`);
    },
    // 添加一个辅助方法，检查日期是否在显示范围内
    isDateInRange(year, month) {
      const startParts = this.startYearMonth.split('-');
      const endParts = this.endYearMonth.split('-');
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]);
      const endYear = parseInt(endParts[0]);
      const endMonth = parseInt(endParts[1]);
      
      return (year > startYear || (year === startYear && month >= startMonth)) && 
             (year < endYear || (year === endYear && month <= endMonth));
    },
    // 更新是否显示当前月份指示器
    updateCurrentMonthVisibility() {
      const currentParts = this.currentYearMonth.split('-');
      const currentYear = parseInt(currentParts[0]);
      const currentMonth = parseInt(currentParts[1]);
      
      this.isCurrentMonthVisible = this.isDateInRange(currentYear, currentMonth);
      console.log(`当前月份${this.currentYearMonth}是否在显示范围内: ${this.isCurrentMonthVisible}`);
    },
    // 添加一个最终调整方法，确保甘特图和表格完全对齐
    finalAdjustment() {
      // 延迟执行，确保之前的样式已经应用
      setTimeout(() => {
        // 重新调整表格高度
        this.adjustTableHeaderHeight();
        
        // 更新网格线
        this.updateGridLines();
        
        // 再次同步表格和甘特图滚动位置
        const ganttContainer = this.$refs.ganttChartContainer;
        const tableBodyWrapper = this.$refs.ganttTable.$el.querySelector('.el-table__body-wrapper');
        
        if (ganttContainer && tableBodyWrapper) {
          // 确保两者滚动位置一致
          const scrollTop = ganttContainer.scrollTop;
          tableBodyWrapper.scrollTop = scrollTop;
        }
      }, 50);
    },
  },
  watch: {
    // 监听项目数据变化，更新网格线
    projectsData: {
      handler() {
        this.$nextTick(() => {
          this.updateGridLines();
        });
      },
      deep: true
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
  overflow: hidden; /* 确保外部容器不显示滚动条 */
  border-right: 2px solid #DCDFE6;
  z-index: 2; /* 确保表格在滚动时位于甘特图上层 */
  position: relative; /* 添加相对定位 */
}

.gantt-table-container /deep/ .gantt-table-header {
  height: v-bind('headerHeight + "px"');
  border-bottom: 1px solid #DCDFE6; /* 添加表头下边框 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
}

.gantt-table-container /deep/ .gantt-table-row {
  height: v-bind('rowHeight + "px"');
  box-sizing: border-box; /* 确保边框计入高度计算 */
}

.gantt-table-container /deep/ .el-table__header-wrapper {
  border-bottom: 1px solid #DCDFE6; /* 添加表头包装器下边框 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
  overflow: hidden; /* 防止出现滚动条 */
}

.gantt-table-container /deep/ .el-table__header {
  border-bottom: 1px solid #DCDFE6; /* 添加表头元素下边框 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
  margin-bottom: -1px; /* 抵消边框高度 */
}

.gantt-table-container /deep/ .el-table__header th {
  padding: 0;
  height: v-bind('headerHeight + "px"');
  border-bottom: 1px solid #DCDFE6; /* 添加表头单元格下边框 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
}

.gantt-table-container /deep/ .el-table__body td {
  padding: 0;
  height: v-bind('rowHeight + "px"');
  box-sizing: border-box; /* 确保边框计入高度计算 */
  border-bottom: 1px solid #EBEEF5; /* 确保边框样式一致 */
}

.gantt-table-container /deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 0; /* 隐藏WebKit浏览器滚动条 */
  height: 0;
}

.gantt-table-container /deep/ .el-table__body-wrapper {
  position: relative; /* 添加相对定位 */
  overflow: hidden !important; /* 确保无滚动条 */
  scrollbar-width: none; /* 隐藏Firefox浏览器滚动条 */
  -ms-overflow-style: none; /* 隐藏IE浏览器滚动条 */
  overflow-y: hidden !important;
  overflow-x: hidden !important;
}

.gantt-table-container /deep/ .el-table__body {
  position: relative; /* 添加相对定位 */
}

.gantt-table-container /deep/ .el-table__body tr {
  position: relative; /* 添加相对定位 */
  border-bottom: 1px solid #EBEEF5; /* 确保边框一致 */
  height: v-bind('rowHeight + "px"'); /* 显式设置高度 */
  box-sizing: border-box; /* 确保边框计入高度 */
}

.gantt-chart-container {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #FAFAFA;
  scrollbar-width: thin;
  scrollbar-color: #DCDFE6 #F5F7FA;
  border-left: none; /* 移除左侧边框，防止重叠 */
}

.gantt-chart-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.gantt-chart-container::-webkit-scrollbar-thumb {
  background-color: #DCDFE6;
  border-radius: 4px;
}

.gantt-chart-container::-webkit-scrollbar-track {
  background-color: #F5F7FA;
}

.gantt-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f7fa;
  border-bottom: 1px solid #DCDFE6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* 年份行在上，月份行在下 */
  user-select: none; /* 防止用户选中文本 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
  height: v-bind('headerHeight + "px"'); /* 明确设置高度 */
}

.year-row {
  display: flex;
  height: v-bind('headerHeight / 2 + "px"'); /* 使用headerHeight的一半作为年份行高度 */
  border-bottom: 1px solid #EBEEF5;
  background-color: #f2f6fc;
  width: max-content;
  overflow: hidden; /* 确保没有溢出 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
}

.year-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-right: 1px solid #EBEEF5;
  position: relative;
  font-size: 14px;
  box-sizing: border-box; /* 确保边框计入宽度 */
}

.year-cell:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px; /* 改为1px，确保不会有多余的宽度 */
  background-color: #DCDFE6;
}

.month-row {
  display: flex;
  height: v-bind('headerHeight / 2 + "px"'); /* 使用headerHeight的一半作为月份行高度 */
  background-color: #f5f7fa;
  width: max-content;
  overflow: hidden; /* 确保没有溢出 */
  box-sizing: border-box; /* 确保边框计入高度计算 */
}

.month-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #EBEEF5;
  position: relative;
  padding: 0 8px;
  font-size: 13px;
  box-sizing: border-box; /* 确保边框计入宽度 */
}

.month-cell.year-boundary-left {
  border-left: 1px solid #DCDFE6; /* 改为1px */
}

/* 修复年末月份的右边框 */
.month-cell.year-boundary-left {
  border-left-width: 1px;
  margin-left: 0;
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
  width: fit-content; /* 使用适应内容的宽度，而不是强制设置最小宽度 */
  border-top: none; /* 移除顶部边框，防止重叠 */
}

.horizontal-grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  transform: translateZ(0); /* 启用GPU加速 */
}

.horizontal-grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #EBEEF5;
  z-index: 1;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  will-change: width; /* 优化渲染性能 */
  transition: width 0.1s ease-out; /* 平滑宽度变化 */
  pointer-events: none; /* 防止干扰鼠标事件 */
  box-sizing: content-box; /* 确保边框不影响位置计算 */
  transform: translateY(0); /* 防止渲染模糊 */
}

.month-grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  transform: translateZ(0); /* 启用GPU加速 */
}

.month-grid-line {
  position: absolute;
  top: 0;
  width: 1px;
  background-color: #EBEEF5;
  box-sizing: border-box; /* 确保边框计入宽度 */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  will-change: height; /* 优化渲染性能 */
  transition: height 0.1s ease-out; /* 平滑高度变化 */
}

.month-grid-line.year-boundary {
  width: 1px; /* 改为1px保持一致 */
  background-color: #DCDFE6;
}

.month-grid-line.current-month {
  background-color: rgba(64, 158, 255, 0.3);
}

.current-month-highlight {
  position: absolute;
  top: 0;
  background-color: rgba(64, 158, 255, 0.05);
  z-index: 1;
  pointer-events: none;
}

.gantt-row {
  position: absolute;
  width: 100%;
  height: v-bind('rowHeight + "px"'); /* 明确设置高度 */
  border-bottom: 1px solid #EBEEF5;
  transition: background-color 0.2s;
  box-sizing: border-box; /* 确保边框计入高度计算 */
}

.gantt-row:hover {
  background-color: rgba(64, 158, 255, 0.05);
}

.gantt-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: v-bind('rowHeight / 2 + "px"'); /* 使用rowHeight的一半作为项目条高度 */
  border-radius: 4px;
  z-index: 3; /* 确保在网格线之上 */
  cursor: pointer;
  overflow: visible; /* 允许标签显示在进度条外部 */
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
  position: relative;
  transition: width 0.3s ease-out;
  border-radius: inherit;
  z-index: 2;
  overflow: hidden; /* 防止内容溢出进度指示器 */
}

.progress-indicator::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0 2px 2px 0;
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
  color: #585858; /* 深色文本，适合在浅色背景上 */
  font-size: 13px;
  white-space: nowrap;
  padding: 0 10px;
  z-index: 4; /* 确保在所有内容之上 */
  /* text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8), -1px -1px 0 rgba(255, 255, 255, 0.8); 文本轮廓，增强可读性 */
  pointer-events: none;
  font-weight: 600;
  overflow: visible;
}

/* 删除可能有问题的选择器 */
/* .progress-indicator + .bar-label {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
} */

.current-month-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #F56C6C;
  z-index: 5;
  pointer-events: none;
  box-shadow: 0 0 5px rgba(245, 108, 108, 0.5);
  animation: pulse 2s infinite;
  will-change: transform, height; /* 优化动画性能 */
  transition: height 0.1s ease-out; /* 平滑高度变化 */
  transform: translateZ(0); /* 启用GPU加速 */
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 2px 1px rgba(245, 108, 108, 0.3);
  }
  50% {
    box-shadow: 0 0 6px 2px rgba(245, 108, 108, 0.6);
  }
  100% {
    box-shadow: 0 0 2px 1px rgba(245, 108, 108, 0.3);
  }
}

.current-date-label-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: visible;
  z-index: 6;
}

.current-date-label {
  position: absolute;
  top: v-bind('-headerHeight/2 - 4 + "px"'); /* 根据headerHeight调整标签位置 */
  left: 50%;
  transform: translateX(-50%);
  background-color: #F56C6C;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  transition: all 0.3s ease;
  user-select: none;
  /* 添加箭头位置的自定义属性 */
  --arrow-left: 50%;
}

.current-date-label::after {
  content: '';
  position: absolute;
  left: var(--arrow-left);
  bottom: -5px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #F56C6C;
  transition: left 0.3s ease;
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

/* 增强滚动平滑性 */
.gantt-chart-container {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #FAFAFA;
  scrollbar-width: thin;
  scrollbar-color: #DCDFE6 #F5F7FA;
}

/* 增强网格线的视觉效果 */
.horizontal-grid-lines, .month-grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  transform: translateZ(0); /* 启用GPU加速 */
}

.gantt-body.resetting-grid-lines .horizontal-grid-line,
.gantt-body.resetting-grid-lines .month-grid-line,
.gantt-body.resetting-grid-lines .current-month-indicator,
.gantt-body.resetting-grid-lines .current-month-highlight {
  transition: none !important;
  width: auto !important;
  height: auto !important;
}

/* 增强水平网格线的可见性 */
.horizontal-grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #EBEEF5;
  z-index: 1;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  will-change: width; /* 优化渲染性能 */
  transition: width 0.1s ease-out; /* 平滑宽度变化 */
}

/* 增强垂直网格线的可见性 */
.month-grid-line {
  position: absolute;
  top: 0;
  width: 1px;
  background-color: #EBEEF5;
  box-sizing: border-box; /* 确保边框计入宽度 */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  will-change: height; /* 优化渲染性能 */
  transition: height 0.1s ease-out; /* 平滑高度变化 */
}

/* 当前月份指示线动画优化 */
.current-month-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #F56C6C;
  z-index: 5;
  pointer-events: none;
  box-shadow: 0 0 5px rgba(245, 108, 108, 0.5);
  animation: pulse 2s infinite;
  will-change: transform, height; /* 优化动画性能 */
  transition: height 0.1s ease-out; /* 平滑高度变化 */
  transform: translateZ(0); /* 启用GPU加速 */
}
</style> 