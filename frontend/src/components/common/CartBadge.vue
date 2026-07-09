<script setup>
defineProps({
  count: { type: Number, default: 0 },
})
</script>

<template>
  <span class="cart-badge">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span v-if="count > 0" class="cart-badge__count">
      {{ count > 99 ? '99+' : count }}
    </span>
  </span>
</template>

<style scoped>
.cart-badge {
  position: relative;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  color: var(--text-primary);
}
.cart-badge svg { display: block; }

.cart-badge__count {
  position: absolute;
  top: -8px;
  right: -12px;
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  padding: 0 4px;
  box-sizing: border-box;
}
</style>
