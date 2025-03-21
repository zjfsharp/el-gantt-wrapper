/**
 * 模拟项目数据
 * 为了展示甘特图的效果，我们创建了跨越多个年份的项目数据，并支持动态列
 */

// 基础项目数据
export const mockProjects = [
  {
    index: 1,
    projName: '产品设计与开发',
    manager: '张三',
    priority: '高',
    startDate: '2022-06',
    endDate: '2023-05',
    progress: 85,
    status: '进行中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '第三季度设计方案变更通知',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '研发部',
        show: 1
      }
    ]
  },
  {
    index: 2,
    projName: '市场调研与分析',
    manager: '李四',
    priority: '中',
    startDate: '2022-03',
    endDate: '2022-09',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '市场调研报告已提交',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '市场部',
        show: 1
      }
    ]
  },
  {
    index: 3,
    projName: '基础设施建设',
    manager: '王五',
    priority: '高',
    startDate: '2022-06',
    endDate: '2024-02',
    progress: 65,
    status: '延期中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '基础设施建设延期原因说明',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '工程部',
        show: 1
      },
      {
        columnName: '延期原因',
        propName: 'delayReason',
        value: '材料供应不足',
        show: 1
      }
    ]
  },
  {
    index: 4,
    projName: '人员招聘与培训',
    manager: '赵六',
    priority: '中',
    startDate: '2022-08',
    endDate: '2023-07',
    progress: 75,
    status: '进行中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '本月新增招聘10人',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '人事部',
        show: 1
      }
    ]
  },
  {
    index: 5,
    projName: '品牌推广计划',
    manager: '钱七',
    priority: '中',
    startDate: '2023-02',
    endDate: '2023-12',
    progress: 40,
    status: '进行中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '线上推广活动准备中',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '市场部',
        show: 1
      }
    ]
  },
  {
    index: 6,
    projName: '系统架构升级',
    manager: '孙八',
    priority: '高',
    startDate: '2023-04',
    endDate: '2024-04',
    progress: 25,
    status: '延期中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '系统架构方案正在重新评估',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '技术部',
        show: 1
      },
      {
        columnName: '延期原因',
        propName: 'delayReason',
        value: '技术方案变更',
        show: 1
      }
    ]
  },
  {
    index: 7,
    projName: '国际市场拓展',
    manager: '周九',
    priority: '高',
    startDate: '2023-09',
    endDate: '2025-03',
    progress: 10,
    status: '未开始',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '正在准备市场调研',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '国际部',
        show: 1
      }
    ]
  },
  {
    index: 8,
    projName: '研发新技术',
    manager: '吴十',
    priority: '高',
    startDate: '2023-11',
    endDate: '2025-06',
    progress: 5,
    status: '未开始',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '新技术研发项目筹备中',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '研发部',
        show: 1
      }
    ]
  },
  {
    index: 9,
    projName: '客户反馈系统',
    manager: '郑十一',
    priority: '中',
    startDate: '2022-05',
    endDate: '2022-11',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '客户反馈系统上线通知',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '客服部',
        show: 1
      }
    ]
  },
  {
    index: 10,
    projName: '内部流程优化',
    manager: '王十二',
    priority: '低',
    startDate: '2022-07',
    endDate: '2023-01',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '流程优化已完成并实施',
        show: 1
      },
      {
        columnName: '负责部门',
        propName: 'department',
        value: '运营部',
        show: 1
      }
    ]
  }
];

// 系统支持的所有可选动态列定义
export const availableExtraColumns = [
  {
    columnName: '通报项',
    propName: 'notifyItem',
    defaultWidth: 150,
    defaultShow: true,
    order: 1
  },
  {
    columnName: '负责部门',
    propName: 'department',
    defaultWidth: 100,
    defaultShow: true,
    order: 2
  },
  {
    columnName: '延期原因',
    propName: 'delayReason',
    defaultWidth: 120,
    defaultShow: false,
    order: 3
  },
  {
    columnName: '风险评估',
    propName: 'riskAssessment',
    defaultWidth: 100,
    defaultShow: false,
    order: 4
  },
  {
    columnName: '预算信息',
    propName: 'budgetInfo',
    defaultWidth: 120,
    defaultShow: false,
    order: 5
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