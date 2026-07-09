<script setup>
// 品牌跑马灯：无缝横向滚动，组件级动效（尊重 reduced-motion）
// 视觉上增加"活力"与节奏变化，破全站统一网格的单调
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <span v-for="(it, i) in items" :key="'a' + i" class="marquee__item">{{ it }}</span>
    </div>
    <div class="marquee__track">
      <span v-for="(it, i) in items" :key="'b' + i" class="marquee__item">{{ it }}</span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  width: 100%;
  padding: 18px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
}
.marquee__item {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(20px, 3vw, 30px);
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  white-space: nowrap;
  opacity: 0.7;
  transition: color var(--dur-1) var(--ease-out), opacity var(--dur-1) var(--ease-out);
}
.marquee__item:hover {
  color: var(--primary);
  opacity: 1;
}
</style>
