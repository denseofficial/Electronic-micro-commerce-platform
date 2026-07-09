<script setup>
import { ref, inject } from 'vue'
import { ElMessage } from 'element-plus'

// 从 App.vue 注入站点配置和更新方法
const siteConfig = inject('siteConfig')
const updateSiteConfig = inject('updateSiteConfig')

// 使用 ref 做本地编辑
const themeColor = ref(siteConfig?.themeColor || '#ff4757')

// 预设主题色（暖色系，与 AppHeader 主题切换保持一致）
const presetColors = ['#ff4757', '#ff6348', '#ff7f50', '#ffa502', '#e84393']

function applyColor(color) {
  themeColor.value = color
  updateSiteConfig({ themeColor: color })
  ElMessage.success(`主题色已切换为 ${color}`)
}
</script>

<template>
  <div class="settings-panel">
    <h3>主题设置</h3>
    <div class="color-grid">
      <button
        v-for="c in presetColors"
        :key="c"
        class="color-btn"
        :style="{ background: c }"
        :class="{ active: c === themeColor }"
        @click="applyColor(c)"
      >
        <span v-if="c === themeColor">✓</span>
      </button>
    </div>
    <p class="hint">
      当前主题色：
      <span :style="{ color: themeColor }">{{ themeColor }}</span>
    </p>
    <p class="note">
      主题色通过 provide/inject 跨级传递，Header/Footer 同步更新
    </p>
  </div>
</template>

<style scoped>
.settings-panel { animation: fadeIn 0.3s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
h3 { font-size: 16px; color: var(--text-primary); margin: 0 0 16px; }
.color-grid { display: flex; gap: 12px; margin-bottom: 16px; }
.color-btn {
  width: 44px; height: 44px; border-radius: 50%; border: 3px solid transparent;
  cursor: pointer; color: #fff; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.color-btn.active { border-color: var(--ink); transform: scale(1.15); box-shadow: 0 2px 8px var(--shadow-md); }
.hint { font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; }
.note { font-size: 12px; color: var(--text-muted); }
</style>
