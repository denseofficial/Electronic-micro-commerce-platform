<script setup>
import AppHeader from '../components/common/AppHeader.vue'
import AppFooter from '../components/common/AppFooter.vue'

// ============ KeepAlive 组件缓存 ============
// 缓存 ProductList 和 Search 页面，保留滚动位置和搜索状态
// include 指定需要缓存的组件名称（组件的 name 属性或 __name）
const cachedViews = ['ProductList', 'Search', 'Home']
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__main">
      <!--
        KeepAlive 缓存页面组件：
        - 切换路由时，被缓存的组件不会销毁/重建
        - include 指定哪些组件需缓存
        - max 限制最大缓存实例数
      -->
      <router-view v-slot="{ Component }">
        <KeepAlive :include="cachedViews" :max="10">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
  box-sizing: border-box;
}
</style>
