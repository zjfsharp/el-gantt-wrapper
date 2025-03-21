<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>甘特图组件比较</h1>
      </el-header>
      <el-main>
        <el-tabs v-model="activeTab" type="card">
          <!-- <el-tab-pane label="v-gantt-chart实现" name="v-gantt">
            <v-gantt-chart-demo />
          </el-tab-pane>
          <el-tab-pane label="frappe-gantt实现" name="frappe">
            <frappe-gantt-demo />
          </el-tab-pane>
          <el-tab-pane label="vue-ganttastic实现" name="ganttastic">
            <vue-ganttastic-demo />
          </el-tab-pane>
          <el-tab-pane label="ElementUI自定义实现" name="custom">
            <CustomGanttDemo />
          </el-tab-pane> -->
          <el-tab-pane label="标准甘特图" name="standard">
            <el-row :gutter="20" class="control-panel">
              <el-col :span="24">
                <h3>标准甘特图 - 默认显示动态列</h3>
                <p>由系统设置的默认动态列（通报项和负责部门）</p>
              </el-col>
            </el-row>
            <CustomGanttDemoFixed
              :cell-width="50"
              :row-height="60"
              :header-height="72"
            />
          </el-tab-pane>
          
          <el-tab-pane label="自定义动态列" name="custom-columns">
            <el-row :gutter="20" class="control-panel">
              <el-col :span="24">
                <h3>自定义动态列</h3>
                <p>选择要显示的列：</p>
                <el-checkbox-group v-model="selectedColumns" @change="handleColumnChange">
                  <el-checkbox v-for="column in availableColumns" 
                               :key="column.propName" 
                               :label="column.propName">
                    {{ column.columnName }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
            <CustomGanttDemoFixed
              :cell-width="50"
              :row-height="60"
              :header-height="72"
              :extra-columns="selectedColumns"
            />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import VGanttChartDemo from './components/VGanttChartDemo.vue';
import FrappeGanttDemo from './components/FrappeGanttDemo.vue';
import VueGanttasticDemo from './components/VueGanttasticDemo.vue';
import CustomGanttDemo from './components/CustomGanttDemo.vue';
import CustomGanttDemoFixed from './components/CustomGanttDemoFixed.vue';
import { availableExtraColumns } from './mockData';

export default {
  name: 'App',
  components: {
    VGanttChartDemo,
    FrappeGanttDemo,
    VueGanttasticDemo,
    CustomGanttDemo,
    CustomGanttDemoFixed
  },
  data() {
    return {
      activeTab: 'standard',
      // 可用的动态列
      availableColumns: availableExtraColumns,
      // 选中的动态列
      selectedColumns: availableExtraColumns
        .filter(col => col.defaultShow)
        .map(col => col.propName)
    };
  },
  methods: {
    // 处理列选择变化
    handleColumnChange(value) {
      console.log('选中的列变更为:', value);
      // 可以在这里添加其他处理逻辑
    }
  }
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
}

.el-main {
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-tabs {
  height: 100%;
}

.el-tab-pane {
  height: calc(100vh - 150px);
  overflow: auto;
}

.control-panel {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: left;
}

.control-panel h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #409EFF;
}

.el-checkbox-group {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
}

.el-checkbox {
  margin-right: 20px;
  margin-bottom: 10px;
}

.extra-fields-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.extra-fields-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #409EFF;
}
</style> 