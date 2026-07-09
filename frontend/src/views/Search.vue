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
    <h1 class="page-title">搜索结果：{{ keyword }}</h1>

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
.page-title { font-size: 22px; font-weight: 700; color: #333; margin: 0 0 20px; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.loading, .empty { text-align: center; padding: 80px 20px; color: #999; font-size: 15px; }
.empty p { font-size: 48px; margin: 0 0 12px; }
.empty p:last-child { font-size: 15px; }

@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
