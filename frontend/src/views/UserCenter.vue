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
.page-title { font-size: 24px; font-weight: 700; color: #333; margin: 0 0 20px; }

.profile-card {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff; border-radius: 16px; padding: 32px;
  text-align: center; margin-bottom: 20px;
}
.avatar { font-size: 56px; margin-bottom: 8px; }
h2 { font-size: 22px; color: #fff; margin: 0 0 4px; }
.username { font-size: 14px; opacity: 0.8; margin: 0; }

.tabs {
  display: flex; gap: 4px; margin-bottom: 16px;
  background: #f5f5f5; border-radius: 10px; padding: 4px;
}
.tabs button {
  flex: 1; padding: 10px; border: none; border-radius: 8px;
  background: none; font-size: 14px; font-weight: 500; color: #666;
  cursor: pointer; transition: all 0.2s;
}
.tabs button.active { background: #fff; color: #ff4757; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

.tab-content { min-height: 150px; margin-bottom: 20px; }

.menu-list {
  background: #fff; border-radius: 12px; overflow: hidden;
}
.menu-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; font-size: 15px; color: #333;
  cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f5f5f5;
}
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: #f9f9f9; }
.menu-item--danger { color: #ff4757; }
.menu-item--admin { color: #3742fa; font-weight: 500; }
.arrow { font-size: 20px; color: #ccc; }
</style>
