import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/styles/ep-theme.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // EP 主题覆盖（须在 element-plus CSS 之后）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './router'
import App from './App.vue'
import { registerDirectives } from './utils/directives'
import { initTheme } from './composables/useTheme'
import './style.css'
import './assets/styles/motion.css'
import './assets/styles/design-upgrades.css'

const app = createApp(App)

// Element Plus UI 组件库（全局注册 + 中文语言包）
app.use(ElementPlus, { locale: zhCn })

// Pinia 状态管理
app.use(createPinia())

// Vue Router 路由
app.use(router)

// 注册全局自定义指令（v-focus / v-lazy / v-permission / v-reveal）
registerDirectives(app)

initTheme()
app.mount('#app')
