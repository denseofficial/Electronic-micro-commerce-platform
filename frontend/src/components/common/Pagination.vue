<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
})

const emit = defineEmits(['change'])

const pages = computed(() => {
  const p = []
  const total = props.totalPages
  const current = props.page
  const maxShow = 7

  if (total <= maxShow) {
    for (let i = 1; i <= total; i++) p.push(i)
  } else {
    p.push(1)
    let start = Math.max(2, current - 2)
    let end = Math.min(total - 1, current + 2)
    if (current <= 3) end = 5
    if (current >= total - 2) start = total - 4
    if (start > 2) p.push('...')
    for (let i = start; i <= end; i++) p.push(i)
    if (end < total - 1) p.push('...')
    p.push(total)
  }
  return p
})

function go(page) {
  if (page === '...' || page < 1 || page > props.totalPages) return
  emit('change', page)
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button :disabled="page <= 1" @click="go(page - 1)">上一页</button>
    <button
      v-for="(p, idx) in pages"
      :key="idx"
      :class="{ active: p === page, ellipsis: p === '...' }"
      :disabled="p === '...'"
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button :disabled="page >= totalPages" @click="go(page + 1)">下一页</button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
}

.pagination button {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled):not(.ellipsis) {
  border-color: #ff4757;
  color: #ff4757;
}

.pagination button.active {
  background: #ff4757;
  color: #fff;
  border-color: #ff4757;
}

.pagination button.ellipsis {
  border: none;
  cursor: default;
}

.pagination button:disabled:not(.ellipsis) {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
