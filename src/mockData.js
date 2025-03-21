/**
 * 模拟项目数据
 * 为了展示甘特图的效果，我们创建了跨越多个年份的项目数据
 */
export const mockProjects = [
  {
    id: '1',
    name: '产品设计与开发',
    manager: '张三',
    priority: '高',
    startDate: '2022-06',
    endDate: '2023-05',
    progress: 85,
    status: '进行中',
  },
  {
    id: '2',
    name: '市场调研与分析',
    manager: '李四',
    priority: '中',
    startDate: '2022-03',
    endDate: '2022-09',
    progress: 100,
    status: '已完成'
  },
  {
    id: '3',
    name: '基础设施建设',
    manager: '王五',
    priority: '高',
    startDate: '2022-06',
    endDate: '2024-02',
    progress: 65,
    status: '进行中'
  },
  {
    id: '4',
    name: '人员招聘与培训',
    manager: '赵六',
    priority: '中',
    startDate: '2022-08',
    endDate: '2023-07',
    progress: 75,
    status: '进行中'
  },
  {
    id: '5',
    name: '品牌推广计划',
    manager: '钱七',
    priority: '中',
    startDate: '2023-02',
    endDate: '2023-12',
    progress: 40,
    status: '进行中'
  },
  {
    id: '6',
    name: '系统架构升级',
    manager: '孙八',
    priority: '高',
    startDate: '2023-04',
    endDate: '2024-04',
    progress: 25,
    status: '进行中'
  },
  {
    id: '7',
    name: '国际市场拓展',
    manager: '周九',
    priority: '高',
    startDate: '2023-09',
    endDate: '2025-03',
    progress: 10,
    status: '进行中'
  },
  {
    id: '8',
    name: '研发新技术',
    manager: '吴十',
    priority: '高',
    startDate: '2023-11',
    endDate: '2025-06',
    progress: 5,
    status: '计划中'
  },
  {
    id: '9',
    name: '客户反馈系统',
    manager: '郑十一',
    priority: '中',
    startDate: '2022-05',
    endDate: '2022-11',
    progress: 100,
    status: '已完成'
  },
  {
    id: '10',
    name: '内部流程优化',
    manager: '王十二',
    priority: '低',
    startDate: '2022-07',
    endDate: '2023-01',
    progress: 100,
    status: '已完成'
  }
];

// 获取当前日期的年份和月份
export const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}-${month < 10 ? '0' + month : month}`;
};

// 获取所有项目的最小和最大日期
export const getDateRange = (projects) => {
  let minDate = null;
  let maxDate = null;
  
  projects.forEach(project => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    if (!minDate || start < minDate) {
      minDate = start;
    }
    
    if (!maxDate || end > maxDate) {
      maxDate = end;
    }
  });
  
  return { minDate, maxDate };
};

// 获取两个日期之间的月份数
export const getMonthsBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  
  return months <= 0 ? 0 : months + 1;
};

// 生成年月标题数组
export const generateYearMonthHeaders = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const headers = [];
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    headers.push({
      year,
      month,
      label: `${year}-${month < 10 ? '0' + month : month}`
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return headers;
}; 