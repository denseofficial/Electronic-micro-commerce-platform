<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useTheme } from '../../composables/useTheme'
import SearchBar from './SearchBar.vue'
import CartBadge from './CartBadge.vue'

// ============ inject 跨级获取站点配置 ============
const siteConfig = inject('siteConfig')

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { theme, toggleTheme } = useTheme()

const keyword = ref('')

function goHome() {
  router.push({ name: 'Home' })
}

function onSearch(val) {
  router.push({ name: 'Search', query: { q: val } })
}

function goLogin() {
  router.push({ name: 'Login' })
}

function goUser() {
  router.push({ name: 'UserCenter' })
}

function goOrders() {
  router.push({ name: 'OrderList' })
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Home' })
}

// 初始化购物车数量
cartStore.fetchCart()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <!-- 品牌 Logo（内联 SVG 替代 emoji） -->
      <div class="header__logo" @click="goHome">
        <span class="logo-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </span>
        <span class="logo-text">{{ siteConfig?.siteName }}</span>
      </div>

      <div class="header__search">
        <SearchBar v-model="keyword" @search="onSearch" />
      </div>

      <nav class="header__nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/products" class="nav-link">全部商品</router-link>
        <router-link to="/flash-sale" class="nav-link nav-link--hot">限时秒杀</router-link>
        <router-link to="/brand" class="nav-link nav-extra">品牌故事</router-link>
        <router-link to="/news" class="nav-link nav-extra">玩机资讯</router-link>
        <router-link to="/membership" class="nav-link nav-extra">会员中心</router-link>

        <!-- 明暗主题切换 -->
        <button
          class="nav-link nav-link--theme"
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
          :title="theme === 'dark' ? '切换到亮色' : '切换到暗色'"
        >
          <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
          </svg>
        </button>

        <router-link to="/cart" class="nav-link nav-link--cart">
          <CartBadge :count="cartStore.totalCount" />
        </router-link>

        <template v-if="authStore.isLoggedIn">
          <div class="nav-dropdown">
            <span class="nav-link nav-link--user">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span class="nav-user-name">{{ authStore.nickname }}</span>
            </span>
            <div class="dropdown-menu">
              <button @click="goUser">个人中心</button>
              <button @click="goOrders">我的订单</button>
              <button @click="handleLogout">退出登录</button>
            </div>
          </div>
        </template>
        <button v-else class="nav-link nav-link--login" @click="goLogin">
          登录
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border-bottom: 1px solid var(--glass-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}
.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--brand-gradient);
  z-index: 1;
}

.header__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 16px;
  gap: 20px;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: #fff;
  box-shadow: var(--shadow-brand);
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: v-bind("siteConfig?.themeColor || '#ff4757'");
}

.header__search {
  flex: 1;
  max-width: 480px;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 14px;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  transition: background-color var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out);
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover {
  background: var(--surface-2);
}

.nav-link--theme:hover {
  color: var(--primary);
}

.nav-link--hot {
  color: var(--primary);
  font-weight: 600;
}

.nav-link--cart {
  padding: 6px 8px;
  position: relative;
}

.nav-link--login {
  background: v-bind("siteConfig?.themeColor || '#ff4757'");
  color: #fff;
  font-weight: 500;
}

.nav-link--login:hover {
  opacity: 0.85;
}

.nav-user-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 次级导航：宽屏展示，窄屏收起（移动端从页脚进入） */
.nav-extra { display: none; }
@media (min-width: 1200px) {
  .nav-extra { display: inline-flex; }
}

/* 下拉菜单 */
.nav-dropdown {
  position: relative;
}

.nav-link--user {
  cursor: default;
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--glass-bg-strong);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 140px;
  overflow: hidden;
  z-index: 200;
}

.nav-dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.dropdown-menu button:hover {
  background: var(--surface-2);
}
</style>
