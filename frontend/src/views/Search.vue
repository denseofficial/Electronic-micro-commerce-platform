<script setup>
import { computed, ref, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/common/ProductCard.vue'
import Pagination from '../components/common/Pagination.vue'

const route = useRoute()
const productStore = useProductStore()

const keyword = ref(route.query.q || '')
const page = ref(1)
const pageSize = 8
let searchTimer = null

const hasKeyword = computed(() => keyword.value.trim().length > 0)
const totalPages = computed(() => Math.ceil(productStore.total / pageSize))
const resultTitle = computed(() => {
  if (!hasKeyword.value) return '请输入关键词进行搜索'
  return `搜索结果：${keyword.value}`
})
const resultSummary = computed(() => {
  if (!hasKeyword.value) return '可以在顶部搜索框输入商品名称或描述关键词'
  return `共找到 ${productStore.total} 件相关商品，当前第 ${page.value} 页`
})

async function loadData() {
  if (hasKeyword.value) {
    await productStore.fetchProducts({ keyword: keyword.value, page: page.value, pageSize })
  } else {
    productStore.list = []
    productStore.total = 0
  }
}

function scheduleSearch() {
  if (searchTimer) window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    loadData()
  }, 300)
}

watch(
  () => route.query.q,
  (val) => {
    keyword.value = val || ''
    page.value = 1
    scheduleSearch()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (searchTimer) {
    window.clearTimeout(searchTimer)
    searchTimer = null
  }
})

function onPageChange(p) {
  page.value = p
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="search-page">
    <h1 class="page-title">{{ resultTitle }}</h1>
    <p class="result-summary">{{ resultSummary }}</p>

    <div v-if="productStore.loading" class="loading">搜索中...</div>
    <div v-else-if="productStore.list.length" class="product-grid">
      <ProductCard v-for="p in productStore.list" :key="p.id" :product="p" />
    </div>
    <div v-else class="empty">
      <p>🔍</p>
      <p>未找到与「{{ keyword }}」相关的商品</p>
    </div>

    <Pagination
      :page="page"
      :total-pages="totalPages"
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
.page-title { font-size: 22px; font-weight: 700; color: #333; margin: 0 0 20px; }
.result-summary { color: #666; margin: -10px 0 18px; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.loading, .empty { text-align: center; padding: 80px 20px; color: #999; font-size: 15px; }
.empty p { font-size: 48px; margin: 0 0 12px; }
.empty p:last-child { font-size: 15px; }

@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
