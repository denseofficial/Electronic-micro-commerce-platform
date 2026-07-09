<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/common/ProductCard.vue'
import Pagination from '../components/common/Pagination.vue'

const route = useRoute()
const productStore = useProductStore()

const keyword = ref(route.query.q || '')
const page = ref(1)

async function loadData() {
  if (keyword.value) {
    await productStore.fetchProducts({ keyword: keyword.value, page: page.value, pageSize: 8 })
  }
}

onMounted(loadData)

watch(() => route.query.q, (val) => {
  keyword.value = val || ''
  page.value = 1
  loadData()
})

function onPageChange(p) {
  page.value = p
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="search-page">
    <h1 class="page-title">
      搜索结果
      <span v-if="keyword" class="page-title__kw">：{{ keyword }}</span>
    </h1>

    <div v-if="productStore.loading" class="state state--loading">
      <span class="state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 21l-4.3-4.3" /><circle cx="11" cy="11" r="7" />
        </svg>
      </span>
      <p class="state__text">搜索中...</p>
    </div>
    <div v-else-if="productStore.list.length" class="product-grid">
      <ProductCard v-for="p in productStore.list" :key="p.id" :product="p" />
    </div>
    <div v-else class="empty">
      <span class="empty__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
      <p class="empty__text">未找到与「{{ keyword }}」相关的商品</p>
      <p class="empty__hint">换个关键词试试吧～</p>
    </div>

    <Pagination
      v-if="!productStore.loading && productStore.list.length"
      :page="page"
      :total-pages="Math.ceil(productStore.total / 8)"
      @change="onPageChange"
    />
  </div>
</template>

<style scoped>
.search-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px;
}
.page-title__kw { color: var(--primary); }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.state--loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 20px;
  color: var(--text-muted);
  font-size: 15px;
}
.state__icon { color: var(--primary); animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 72px 20px;
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
}
.empty__icon { color: var(--text-placeholder); margin-bottom: 4px; }
.empty__text { font-size: 15px; color: var(--text-secondary); margin: 0; }
.empty__hint { font-size: 13px; color: var(--text-muted); margin: 0; }

@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
</style>
