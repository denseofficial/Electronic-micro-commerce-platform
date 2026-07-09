<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import SearchBar from './SearchBar.vue'
import CartBadge from './CartBadge.vue'

// ============ inject 跨级获取站点配置 ============
// 从 App.vue（祖先组件）注入，无需逐层 props 传递
const siteConfig = inject('siteConfig')
const updateSiteConfig = inject('updateSiteConfig')

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

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

// 切换主题色（演示 inject 获取的更新方法）
function toggleTheme() {
  const colors = ['#ff4757', '#3742fa', '#2ed573', '#ff6348', '#a55eea']
  const current = colors.indexOf(siteConfig.value.themeColor)
  const next = (current + 1) % colors.length
  updateSiteConfig({ themeColor: colors[next] })
}

// 初始化购物车数量
cartStore.fetchCart()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <!-- 来自 provide/inject 的站点配置 -->
      <div class="header__logo" @click="goHome">
        <span class="logo-icon">{{ siteConfig?.logoIcon }}</span>
        <span class="logo-text">{{ siteConfig?.siteName }}</span>
      </div>

      <div class="header__search">
        <SearchBar v-model="keyword" @search="onSearch" />
      </div>

      <nav class="header__nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/products" class="nav-link">全部商品</router-link>
        <router-link to="/stats" class="nav-link">数据统计</router-link>

        <router-link to="/cart" class="nav-link nav-link--cart">
          <CartBadge :count="cartStore.totalCount" />
        </router-link>

        <template v-if="authStore.isLoggedIn">
          <div class="nav-dropdown">
            <span class="nav-link nav-link--user">
              👤 {{ authStore.nickname }}
            </span>
            <div class="dropdown-menu">
              <button @click="goUser">个人中心</button>
              <button @click="goOrders">我的订单</button>
              <button @click="toggleTheme">🎨 切换主题色</button>
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
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
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
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: v-bind("siteConfig?.themeColor || '#ff4757'");
}

.header__search {
  flex: 1;
  max-width: 480px;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover {
  background: #f5f5f5;
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
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: #333;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.dropdown-menu button:hover {
  background: #f5f5f5;
}
</style>
