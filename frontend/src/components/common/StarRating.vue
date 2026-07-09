<script setup>
defineProps({
  rating: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
})

function starClass(index, rating) {
  const diff = rating - index
  if (diff >= 1) return 'star full'
  if (diff >= 0.5) return 'star half'
  return 'star empty'
}
</script>

<template>
  <span class="star-rating" :title="`${rating} 分`">
    <span
      v-for="i in max"
      :key="i"
      :class="starClass(i - 1, rating)"
    >★</span>
    <span class="star-rating__num">{{ rating }}</span>
  </span>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  font-size: 14px;
}

.star {
  font-size: 14px;
}

.star.full {
  color: #f39c12;
}

.star.half {
  color: #f39c12;
  opacity: 0.5;
}

.star.empty {
  color: #ddd;
}

.star-rating__num {
  margin-left: 4px;
  color: #f39c12;
  font-weight: 600;
  font-size: 13px;
}
</style>
