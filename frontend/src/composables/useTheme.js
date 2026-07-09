import { ref } from 'vue'

const STORAGE_KEY = 'ec_mall_theme'
const theme = ref('light')

function applyTheme(value) {
  const el = document.documentElement
  el.setAttribute('data-theme', value)
  // Element Plus 暗色变量作用于 .dark 类，需同步挂载
  el.classList.toggle('dark', value === 'dark')
  theme.value = value
}

/** 应用启动时调用：读取本地偏好，无则跟随系统配色 */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(saved || (prefersDark ? 'dark' : 'light'))
}

/** 组件内使用：获取当前主题并切换明暗 */
export function useTheme() {
  function toggleTheme() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }
  return { theme, toggleTheme }
}
