<script setup>
import { provide, ref } from 'vue'

// ============ provide/inject 跨级数据传递 ============
// 祖先组件提供站点配置，任意子孙组件可通过 inject 获取
const siteConfig = ref({
  siteName: '电子微商城',
  themeColor: '#ff4757',
  currency: '¥',
  logoIcon: '🛒',
  contactEmail: 'service@ecmall.com',
  copyright: '© 2024 电子微商城 — Vue 3 + Vite 实战项目',
})

// 更新站点配置的方法（一并 provide 以便子组件修改主题等）
function updateSiteConfig(partial) {
  Object.assign(siteConfig.value, partial)
}

provide('siteConfig', siteConfig)
provide('updateSiteConfig', updateSiteConfig)
</script>

<template>
  <router-view />
</template>
