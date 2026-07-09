<script setup>
// 水平滑动货架：编辑式横滑排版，破统一竖向网格
// 默认插槽放入卡片（ProductCard 等），桌面端留溢出供探索，移动端整卡横滑
defineProps({
  title: { type: String, default: '' },
  more: { type: String, default: '' },
})
</script>

<template>
  <section class="rail-section">
    <div v-if="title" class="rail-section__head">
      <h2 class="section__title font-display">{{ title }}</h2>
      <span v-if="more" class="section__more">{{ more }}</span>
    </div>
    <div class="rail">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.rail-section {
  margin-bottom: var(--section-gap);
}
.rail-section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
}
.rail-section__head .section__title {
  font-size: var(--text-2xl);
}
.rail-section__head .section__more {
  font-size: 13px;
  color: var(--primary);
  font-weight: 500;
}
</style>
