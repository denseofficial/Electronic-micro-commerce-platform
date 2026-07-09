<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <p class="icon">🔍</p>
    <h1>404</h1>
    <p class="desc">抱歉，您访问的页面不存在</p>
    <button class="home-btn" @click="router.push({ name: 'Home' })">返回首页</button>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center; padding: 100px 20px;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.icon { font-size: 72px; margin: 0; }
h1 { font-size: 56px; color: #333; margin: 0 0 8px; }
.desc { font-size: 16px; color: #999; margin: 0 0 24px; }
.home-btn {
  padding: 12px 40px; background: #ff4757; color: #fff;
  border: none; border-radius: 8px; font-size: 16px; cursor: pointer;
}
.home-btn:hover { opacity: 0.9; }
</style>
