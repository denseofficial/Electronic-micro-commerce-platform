<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found__card">
      <span class="not-found__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
      <h1>404</h1>
      <p class="desc">抱歉，您访问的页面不存在</p>
      <button class="home-btn" @click="router.push({ name: 'Home' })">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.not-found__card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 48px 56px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.45);
}
.not-found__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--primary-bg);
  color: var(--primary);
  margin-bottom: 8px;
}
h1 { font-size: 56px; color: var(--text-primary); margin: 0; line-height: 1; }
.desc { font-size: 16px; color: var(--text-muted); margin: 0 0 24px; }
.home-btn {
  padding: 12px 40px;
  background: var(--brand-gradient);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-brand);
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out);
}
.home-btn:hover { transform: translateY(-1px); }
</style>
