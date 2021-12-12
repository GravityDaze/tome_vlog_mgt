import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './router/permit' // 路由鉴权
import './index.css' // tailwindcss
import 'ant-design-vue/dist/antd.css'

createApp(App).use(router).use(createPinia()).mount('#app')
