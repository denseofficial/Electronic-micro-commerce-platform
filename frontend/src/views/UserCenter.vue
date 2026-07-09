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
    <header class="profile-card glass">
      <div class="avatar">
        <svg
          class="avatar__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h2 class="profile-card__name">{{ authStore.nickname }}</h2>
      <p class="profile-card__username">@{{ authStore.user?.username }}</p>
    </header>

    <!-- Tab 切换栏 -->
    <nav class="tabs" role="tablist" aria-label="个人中心导航">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        class="tabs__btn"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="switchTab(tab)"
      >
        {{ tab.label }}
      </button>
    </nav>

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
    <section class="menu glass">
      <button class="menu-item" @click="router.push({ name: 'OrderList' })">
        <span class="menu-item__icon menu-item__icon--brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </span>
        <span class="menu-item__label">我的订单</span>
        <span class="menu-item__arrow" aria-hidden="true">›</span>
      </button>

      <button class="menu-item" @click="router.push({ name: 'Cart' })">
        <span class="menu-item__icon menu-item__icon--brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </span>
        <span class="menu-item__label">购物车</span>
        <span class="menu-item__arrow" aria-hidden="true">›</span>
      </button>

      <!-- v-permission 自定义指令演示 -->
      <button
        v-permission="'admin'"
        class="menu-item menu-item--admin"
        @click="router.push('/')"
      >
        <span class="menu-item__icon menu-item__icon--admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </span>
        <span class="menu-item__label">管理后台（仅管理员可见）</span>
        <span class="menu-item__arrow" aria-hidden="true">›</span>
      </button>

      <button
        class="menu-item menu-item--danger"
        @click="authStore.logout(); router.push('/')"
      >
        <span class="menu-item__icon menu-item__icon--danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>
        <span class="menu-item__label">退出登录</span>
        <span class="menu-item__arrow" aria-hidden="true">›</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.user-page {
  animation: fadeIn 0.4s var(--ease-out);
  max-width: 600px;
  margin: 0 auto;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px;
}

/* ---------- 资料卡（玻璃质感 + 品牌渐变头像） ---------- */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 24px;
  border-radius: var(--radius-xl);
  margin-bottom: 20px;
}
.avatar {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-gradient);
  color: #fff;
  box-shadow: var(--shadow-brand);
  margin-bottom: 6px;
}
.avatar__icon { width: 36px; height: 36px; }
.profile-card__name {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}
.profile-card__username {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin: 0;
}

/* ---------- Tab 切换栏（分段控件） ---------- */
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  padding: 5px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.tabs__btn {
  flex: 1;
  padding: 11px 8px;
  border: none;
  border-radius: var(--radius-md);
  background: none;
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--dur-1) var(--ease-out),
    color var(--dur-1) var(--ease-out), box-shadow var(--dur-1) var(--ease-out);
}
.tabs__btn.active {
  background: var(--bg-white);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.tab-content { min-height: 150px; margin-bottom: 20px; }

/* ---------- 功能菜单（玻璃列表 + 图标 chip） ---------- */
.menu {
  border-radius: var(--radius-lg);
  padding: 6px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 13px 14px;
  border: none;
  border-radius: var(--radius-md);
  background: none;
  text-align: left;
  font-size: var(--text-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--dur-1) var(--ease-out),
    transform var(--dur-1) var(--ease-out);
}
.menu-item + .menu-item { margin-top: 2px; }
.menu-item:hover {
  background: var(--primary-bg);
  transform: translateX(2px);
}
.menu-item:active { transform: translateX(0); }

.menu-item__icon {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  color: var(--text-secondary);
  transition: background var(--dur-1) var(--ease-out),
    color var(--dur-1) var(--ease-out);
}
.menu-item__icon svg { width: 20px; height: 20px; }
.menu-item__icon--brand { background: var(--primary-bg); color: var(--primary); }
.menu-item__icon--admin { background: var(--accent-bg); color: var(--accent); }
.menu-item__icon--danger { background: var(--primary-bg); color: var(--primary); }

.menu-item__label { flex: 1; min-width: 0; font-weight: 500; }
.menu-item__arrow { color: var(--text-placeholder); font-size: 20px; line-height: 1; }

.menu-item--admin .menu-item__label { color: var(--accent); font-weight: 600; }
.menu-item--danger .menu-item__label { color: var(--danger); }

/* ---------- 响应式 ---------- */
@media (max-width: 480px) {
  .avatar { width: 58px; height: 58px; }
  .avatar__icon { width: 32px; height: 32px; }
}
</style>
