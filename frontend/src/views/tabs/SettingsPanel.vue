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
    <header class="settings-head">
      <h3 class="settings-title">主题设置</h3>
      <p class="settings-sub">为你的商城挑选专属品牌色</p>
    </header>

    <div class="color-grid">
      <button
        v-for="c in presetColors"
        :key="c"
        class="color-btn"
        :style="{ background: c }"
        :class="{ active: c === themeColor }"
        :aria-label="`主题色 ${c}`"
        @click="applyColor(c)"
      >
        <svg
          v-if="c === themeColor"
          class="check"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>

    <p class="hint">
      当前主题色：
      <span :style="{ color: themeColor }" class="hint__value">{{ themeColor }}</span>
    </p>
    <p class="note">
      主题色通过 provide/inject 跨级传递，Header/Footer 同步更新
    </p>
  </div>
</template>

<style scoped>
.settings-panel {
  animation: fadeIn 0.3s var(--ease-out);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.settings-head { margin-bottom: 18px; }
.settings-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}
.settings-sub {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ---------- 主题色色板 ---------- */
.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 18px;
}
.color-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--dur-1) var(--ease-out),
    box-shadow var(--dur-1) var(--ease-out),
    border-color var(--dur-1) var(--ease-out);
}
.color-btn:hover { transform: scale(1.08); }
.color-btn.active {
  border-color: var(--bg-white);
  transform: scale(1.14);
  box-shadow: var(--shadow-md);
}
.check { width: 22px; height: 22px; }

.hint {
  font-size: var(--text-md);
  color: var(--text-secondary);
  margin: 0 0 8px;
}
.hint__value { font-weight: 700; }

.note {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}
</style>
