/**
 * 模拟项目数据
 * 为了展示甘特图的效果，我们创建了跨越多个年份的项目数据，并支持动态列
 */

// 基础项目数据
export const mockProjects = [
  {
    index: 1,
    projName: '产品设计与开发',
    startDate: '2022-06',
    endDate: '2023-05',
    progress: 85,
    status: '进行中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '第三季度设计方案变更通知',
        align: 'left',
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
    startDate: '2022-03',
    endDate: '2022-09',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '市场调研报告已提交',
        align: 'left',
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
    startDate: '2022-06',
    endDate: '2024-02',
    progress: 65,
    status: '延期中',
    extraFields: [
      {
        columnName: '通报项',
        propName: 'notifyItem',
        value: '基础设施建设延期原因说明',
        align: 'left',
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
    startDate: '2022-08',
    endDate: '2023-07',
    progress: 75,
    status: '进行中',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
    startDate: '2023-02',
    endDate: '2023-12',
    progress: 40,
    status: '进行中',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
    startDate: '2023-04',
    endDate: '2024-04',
    progress: 25,
    status: '延期中',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
    startDate: '2023-09',
    endDate: '2025-03',
    progress: 10,
    status: '未开始',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
    startDate: '2023-11',
    endDate: '2025-06',
    progress: 5,
    status: '未开始',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
    startDate: '2022-05',
    endDate: '2022-11',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
    startDate: '2022-07',
    endDate: '2023-01',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
  },
  {
    index: 11,
    projName: '内部流程优化11',
    startDate: '2022-07',
    endDate: '2023-01',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
  },
  {
    index: 12,
    projName: '内部流程优化12',
    startDate: '2022-07',
    endDate: '2023-01',
    progress: 100,
    status: '已完成',
    extraFields: [
      {
        columnName: '通报项',
        align: 'left',
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
