/**
 * 全局自定义指令
 * 在 main.js 中通过 app.directive() 注册
 */

// ============ v-focus：自动聚焦 ============
// 用法：<input v-focus />
export const vFocus = {
  mounted(el) {
    el.focus()
  },
}

// ============ v-lazy：图片懒加载 ============
// 用法：<img v-lazy="imageUrl" />
// 使用 IntersectionObserver 在图片进入视口时才加载
export const vLazy = {
  mounted(el, binding) {
    // 设置占位样式
    el.style.backgroundColor = '#f0f0f0'
    el.style.transition = 'opacity 0.3s'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = binding.value
          el.onload = () => {
            el.style.opacity = '1'
          }
          observer.unobserve(el)
        }
      },
      { rootMargin: '100px' }, // 提前 100px 开始加载
    )
    observer.observe(el)
  },
}

// ============ v-permission：按钮权限控制 ============
// 用法：<button v-permission="'admin'">管理员操作</button>
// 根据用户角色决定是否显示元素
export const vPermission = {
  mounted(el, binding) {
    // 从 localStorage 获取当前用户角色
    let userRole = 'user' // 默认角色
    try {
      const raw = localStorage.getItem('ec_mall_user')
      if (raw) {
        const user = JSON.parse(raw)
        userRole = user.role || 'user'
      }
    } catch {
      // ignore
    }

    const requiredRole = binding.value
    // 简单权限判断：admin 可以访问所有，user 只能访问 user 级别
    const hasPermission =
      userRole === 'admin' || requiredRole === 'user' || userRole === requiredRole

    if (!hasPermission) {
      el.style.display = 'none'
    }
  },
}

// ============ v-reveal：滚动渐入 ============
// 用法：<div v-reveal> 或 <div v-reveal="{ delay: 120 }">
// 元素进入视口时添加 .js-reveal--in 触发渐入；尊重减弱动效偏好
export const vReveal = {
  mounted(el, binding) {
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    el.classList.add('js-reveal')
    if (binding.value?.delay) {
      el.style.transitionDelay = `${binding.value.delay}ms`
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('js-reveal--in')
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
  },
}

/**
 * 注册所有全局指令
 * @param {import('vue').App} app
 */
export function registerDirectives(app) {
  app.directive('focus', vFocus)
  app.directive('lazy', vLazy)
  app.directive('permission', vPermission)
  app.directive('reveal', vReveal)
}
