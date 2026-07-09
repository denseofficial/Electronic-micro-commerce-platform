<script setup>
defineProps({
  count: { type: Number, default: 0 },
})
</script>

<template>
  <span class="cart-badge">
    🛒
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
}

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
