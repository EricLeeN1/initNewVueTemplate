import { createApp } from 'vue';
import './styles/index.scss';
import App from './App.vue';
import store from './stores';
import router from './routers';
import './permission';

// 创建vue实例
const app = createApp(App);

// 挂载pinia
app.use(store);
// 挂载router
app.use(router);

// 挂载实例
app.mount('#app');
