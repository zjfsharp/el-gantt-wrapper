import ElGanttWrapper from './components/ElGanttWrapper.vue';

// 导出单个组件
export default ElGanttWrapper;

// 导出为Vue插件
export const ElGanttWrapperPlugin = {
  install(Vue) {
    Vue.component('ElGanttWrapper', ElGanttWrapper);
  }
};

// 导出组件
export { ElGanttWrapper }; 