<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '../components/common/AppHeader.vue'
import AppFooter from '../components/common/AppFooter.vue'

// ============ 返回顶部 ============
const showBackTop = ref(false)

function onScroll() {
  showBackTop.value = window.scrollY > 480
}
function scrollToTop() {
  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// ============ KeepAlive 组件缓存 ============
// 缓存 ProductList 和 Search 页面，保留滚动位置和搜索状态
const cachedViews = ['ProductList', 'Search', 'Home']
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__main">
      <router-view v-slot="{ Component }">
        <KeepAlive :include="cachedViews" :max="10">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </main>
    <AppFooter />

    <transition name="backtop-fade">
      <button
        v-show="showBackTop"
        class="back-top"
        aria-label="返回顶部"
        title="返回顶部"
        @click="scrollToTop"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </transition>
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
  padding: 24px 16px 40px;
  box-sizing: border-box;
}

.back-top {
  position: fixed;
  right: 24px;
  bottom: 28px;
  z-index: 150;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--brand-gradient);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-brand);
  transition: transform var(--dur-1) var(--ease-out),
    box-shadow var(--dur-1) var(--ease-out);
}
.back-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(255, 71, 87, 0.34);
}

.backtop-fade-enter-active,
.backtop-fade-leave-active {
  transition: opacity var(--dur-1) var(--ease-out),
    transform var(--dur-1) var(--ease-out);
}
.backtop-fade-enter-from,
.backtop-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .layout__main {
    padding: 16px 12px 32px;
  }
  .back-top {
    right: 16px;
    bottom: 20px;
  }
}
</style>
