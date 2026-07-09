<script setup>
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ProfilePanel from './tabs/ProfilePanel.vue'
import AddressPanel from './tabs/AddressPanel.vue'
import SettingsPanel from './tabs/SettingsPanel.vue'

// ============ 动态组件 component :is ============
// shallowRef 用于动态组件引用（只做浅层响应）
const currentTab = shallowRef(ProfilePanel)
const activeTab = ref('profile')

const tabs = [
  { key: 'profile', label: '个人信息', component: ProfilePanel },
  { key: 'address', label: '收货地址', component: AddressPanel },
  { key: 'settings', label: '设置', component: SettingsPanel },
]

function switchTab(tab) {
  activeTab.value = tab.key
  currentTab.value = tab.component
}

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <div class="user-page">
    <h1 class="page-title">个人中心</h1>

    <!-- 用户信息卡片（使用 provide/inject 的 siteConfig） -->
    <div class="profile-card">
      <div class="avatar">👤</div>
      <h2>{{ authStore.nickname }}</h2>
      <p class="username">@{{ authStore.user?.username }}</p>
    </div>

    <!-- Tab 切换栏 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!--
      ============ 动态组件 component :is ============
      根据 currentTab 动态切换渲染不同面板组件
      配合 KeepAlive 缓存切换状态（如地址面板的编辑状态）
    -->
    <div class="tab-content">
      <KeepAlive>
        <component :is="currentTab" />
      </KeepAlive>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-list">
      <div class="menu-item" @click="router.push({ name: 'OrderList' })">
        <span>📦 我的订单</span>
        <span class="arrow">›</span>
      </div>
      <div class="menu-item" @click="router.push({ name: 'Cart' })">
        <span>🛒 购物车</span>
        <span class="arrow">›</span>
      </div>
      <!-- v-permission 自定义指令演示 -->
      <div
        v-permission="'admin'"
        class="menu-item menu-item--admin"
        @click="router.push('/')"
      >
        <span>⚙️ 管理后台（仅管理员可见）</span>
        <span class="arrow">›</span>
      </div>
      <div
        class="menu-item menu-item--danger"
        @click="authStore.logout(); router.push('/')"
      >
        <span>🚪 退出登录</span>
        <span class="arrow">›</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-page { animation: fadeIn 0.4s ease; max-width: 600px; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-title { font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary); margin: 0 0 20px; }

.profile-card {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: #fff; border-radius: var(--radius-lg); padding: 32px;
  text-align: center; margin-bottom: 20px;
}
.avatar { font-size: 56px; margin-bottom: 8px; }
h2 { font-size: 22px; color: #fff; margin: 0 0 4px; }
.username { font-size: 14px; opacity: 0.8; margin: 0; }

.tabs {
  display: flex; gap: 4px; margin-bottom: 16px;
  background: var(--surface-2); border-radius: var(--radius-md); padding: 4px;
}
.tabs button {
  flex: 1; padding: 10px; border: none; border-radius: var(--radius-sm);
  background: none; font-size: 14px; font-weight: 500; color: var(--text-secondary);
  cursor: pointer; transition: all 0.2s;
}
.tabs button.active { background: var(--bg-white); color: var(--primary); box-shadow: var(--shadow-sm); }

.tab-content { min-height: 150px; margin-bottom: 20px; }

.menu-list {
  background: var(--bg-white); border-radius: var(--radius-md); overflow: hidden;
  border: 1px solid var(--border);
}
.menu-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; font-size: 15px; color: var(--text-primary);
  cursor: pointer; transition: background var(--dur-1) var(--ease-out); border-bottom: 1px solid var(--border-light);
}
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: var(--surface-2); }
.menu-item--danger { color: var(--primary); }
.menu-item--admin { color: var(--warning); font-weight: 500; }
.arrow { font-size: 20px; color: var(--text-placeholder); }
</style>
