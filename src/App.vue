<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>甘特图组件比较</h1>
      </el-header>
      <el-main>
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="v-gantt-chart实现" name="v-gantt">
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
          </el-tab-pane>
          <el-tab-pane label="ElementUI优化实现" name="custom-fixed">
            <CustomGanttDemoFixed />
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
      activeTab: 'custom-fixed'
    };
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
</style> 