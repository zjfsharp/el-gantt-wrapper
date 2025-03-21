<template>
  <div id="app">
    <div class="app-header">
      <h1>Vue2 甘特图组件演示</h1>
      <div class="header-actions">
        <el-button type="primary" size="small" icon="el-icon-document" @click="showGuide = true">
          使用指南
        </el-button>
        <el-button type="info" size="small" icon="el-icon-question" @click="showHelp = true">
          关于组件
        </el-button>
      </div>
    </div>

    <div class="demo-description">
      <p>这是一个基于Vue2和ElementUI的甘特图组件，支持动态列控制、项目过滤和自适应设计。</p>
    </div>

    <el-tabs v-model="activeTab" type="card" class="demo-tabs">
      <el-tab-pane label="基础甘特图" name="basic">
        <CustomGanttDemoFixed 
          :projects="mockProjects" 
          :show-column-control="false" 
          :max-visible-rows="5"
          @row-action="handleProjectClick" 
        />
      </el-tab-pane>
      <el-tab-pane label="可控制动态列" name="dynamic">
        <CustomGanttDemoFixed 
          :projects="mockProjects" 
          :show-column-control="true" 
          :show-filter="true"
          :max-visible-rows="8"
          :project-name-column-width="200"
          :status-column-width="80"
          :operation-column-width="100"
          @row-action="handleProjectClick">
          <template #operation="{ row }">
            <div class="operation-buttons">
              <el-button size="mini" type="primary" icon="el-icon-view" @click="handleViewProject(row)">查看</el-button>
              <!-- <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEditProject(row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteProject(row)">删除</el-button> -->
            </div>
          </template>
        </CustomGanttDemoFixed>
      </el-tab-pane>
      <el-tab-pane label="高度调整示例" name="height">
        <CustomGanttDemoFixed 
          :projects="mockProjects" 
          :show-column-control="true"
          :max-visible-rows="maxRows"
          @row-action="handleProjectClick"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 使用指南对话框 -->
    <el-dialog
      title="甘特图组件使用指南"
      :visible.sync="showGuide"
      width="60%"
      class="guide-dialog"
    >
      <div class="guide-content">
        <h3>基本使用</h3>
        <pre><code>
import CustomGanttDemoFixed from './components/CustomGanttDemoFixed.vue';
import { mockProjects } from './mockData';

export default {
  components: {
    CustomGanttDemoFixed
  },
  data() {
    return {
      projects: mockProjects
    };
  },
  methods: {
    handleRowAction(project) {
      console.log('项目动作:', project);
    }
  }
}
        </code></pre>

        <h3>数据格式</h3>
        <p>项目数据需要符合以下格式：</p>
        <pre><code>
{
  index: Number,           // 唯一索引
  projName: String,        // 项目名称
  manager: String,         // 项目经理
  priority: String,        // 优先级
  startDate: String,       // 开始日期 (格式: YYYY-MM)
  endDate: String,         // 结束日期 (格式: YYYY-MM)
  progress: Number,        // 进度百分比 (0-100)
  status: String,          // 项目状态
  extraFields: [           // 动态列字段
    {
      columnName: String,  // 列名称
      propName: String,    // 属性名
      value: String,       // 值
      show: Number         // 是否显示 (1显示，0不显示)
    }
  ]
}
        </code></pre>

        <h3>主要属性</h3>
        <ul>
          <li><strong>projects</strong>: 项目数据数组</li>
          <li><strong>showColumnControl</strong>: 是否显示列控制面板</li>
          <li><strong>headerHeight</strong>: 表头高度(默认: 40px)</li>
          <li><strong>rowHeight</strong>: 行高(默认: 44px)</li>
          <li><strong>maxVisibleRows</strong>: 最大可见行数(默认: 10)，超出部分通过滚动查看</li>
        </ul>

        <h3>事件</h3>
        <ul>
          <li><strong>row-action</strong>: 当项目行动作被触发时触发(例如点击操作按钮)</li>
          <li><strong>project-filter-change</strong>: 当项目过滤条件变化时触发</li>
        </ul>

        <h3>插槽</h3>
        <ul>
          <li><strong>operation</strong>: 自定义操作列的内容，接收 { row } 作为参数</li>
        </ul>
        
        <h4>操作列插槽示例：</h4>
        <pre><code>
&lt;CustomGanttDemoFixed 
  :projects="projects"
  @row-action="handleRowAction"&gt;
  &lt;template #operation="{ row }"&gt;
    &lt;div class="operation-buttons"&gt;
      &lt;el-button size="mini" @click="handleView(row)"&gt;查看&lt;/el-button&gt;
      &lt;el-button size="mini" @click="handleEdit(row)"&gt;编辑&lt;/el-button&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/CustomGanttDemoFixed&gt;
        </code></pre>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showGuide = false">我知道了</el-button>
      </span>
    </el-dialog>

    <!-- 关于组件对话框 -->
    <el-dialog
      title="关于甘特图组件"
      :visible.sync="showHelp"
      width="50%"
      class="help-dialog"
    >
      <div class="help-content">
        <h3>组件特性</h3>
        <ul>
          <li>✅ 响应式设计，适应不同屏幕尺寸</li>
          <li>✅ 动态列控制，可自定义显示/隐藏列</li>
          <li>✅ 内置项目过滤功能</li>
          <li>✅ 表格与甘特图区域滚动同步</li>
          <li>✅ 项目进度条可视化</li>
          <li>✅ 项目状态颜色区分</li>
          <li>✅ 可控制最大显示行数，提高性能</li>
        </ul>

        <h3>开发者信息</h3>
        <p>本甘特图组件基于Vue2和ElementUI开发，完全开源，使用MIT许可证。</p>
        <p>更多信息请查看项目的README.md文件。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showHelp = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 项目详情对话框 -->
    <el-dialog
      title="项目详情"
      :visible.sync="showProjectDetails"
      width="50%"
      class="project-details-dialog"
    >
      <div v-if="selectedProject" class="project-details">
        <div class="project-header">
          <h3>{{ selectedProject.projName }}</h3>
          <el-tag :type="getStatusType(selectedProject.status)">{{ selectedProject.status }}</el-tag>
        </div>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">项目经理:</span>
              <span>{{ selectedProject.manager }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">优先级:</span>
              <span>{{ selectedProject.priority }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">开始日期:</span>
              <span>{{ selectedProject.startDate }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">结束日期:</span>
              <span>{{ selectedProject.endDate }}</span>
            </div>
          </el-col>
        </el-row>
        
        <div class="detail-item">
          <span class="detail-label">进度:</span>
          <el-progress :percentage="selectedProject.progress" :format="percentageFormat"></el-progress>
        </div>
        
        <h4>附加信息</h4>
        <el-table :data="getExtraFields(selectedProject)" stripe style="width: 100%">
          <el-table-column prop="columnName" label="名称" width="180"></el-table-column>
          <el-table-column prop="value" label="内容"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showProjectDetails = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CustomGanttDemoFixed from '@/components/CustomGanttDemoFixed.vue';
import { mockProjects } from '@/mockData';

export default {
  name: 'App',
  components: {
    CustomGanttDemoFixed
  },
  data() {
    return {
      activeTab: 'dynamic',
      mockProjects,
      showGuide: false,
      showHelp: false,
      showProjectDetails: false,
      selectedProject: null,
      maxRows: 10
    };
  },
  methods: {
    handleProjectClick(project) {
      this.selectedProject = project;
      this.showProjectDetails = true;
    },
    handleViewProject(project) {
      this.selectedProject = project;
      this.showProjectDetails = true;
    },
    handleEditProject(project) {
      this.$message({
        message: `准备编辑项目：${project.projName}`,
        type: 'success'
      });
    },
    handleDeleteProject(project) {
      this.$confirm(`确定要删除项目 ${project.projName} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: `项目 ${project.projName} 已删除!`
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });     
      });
    },
    getStatusType(status) {
      const statusMap = {
        '已完成': 'success',
        '进行中': 'primary',
        '延期中': 'danger',
        '未开始': 'info'
      };
      return statusMap[status] || 'info';
    },
    percentageFormat(percentage) {
      return `${percentage}%`;
    },
    getExtraFields(project) {
      if (!project || !project.extraFields) return [];
      return project.extraFields;
    }
  }
};
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
  color: #409EFF;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.demo-description {
  margin-bottom: 10px;
  padding: 5px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #5e6d82;
}

.demo-tabs {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.guide-content, .help-content {
  padding: 10px;
  line-height: 1.6;
}

pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
}

code {
  font-family: Monaco, Menlo, Consolas, 'Courier New', monospace;
  color: #476582;
}

.project-details {
  padding: 10px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.project-header h3 {
  margin: 0;
  color: #303133;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-label {
  font-weight: bold;
  margin-right: 5px;
  color: #606266;
}

h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}

/* 在小屏幕上使按钮更小，只显示图标 */
@media (max-width: 1200px) {
  .operation-buttons .el-button {
    padding: 6px;
  }
  
  .operation-buttons .el-button span {
    display: none;
  }
}

.height-control-panel {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f9eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.height-control-panel span {
  margin-right: 15px;
  font-weight: bold;
  color: #606266;
  min-width: 100px;
}

.height-control-panel .el-slider {
  width: 70%;
}
</style> 