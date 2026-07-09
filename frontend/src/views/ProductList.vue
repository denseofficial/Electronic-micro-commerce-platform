<script setup>
import { ref, onMounted, watch, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/common/ProductCard.vue'
import Pagination from '../components/common/Pagination.vue'

// ============ KeepAlive 生命周期演示 ============
// 从商品详情返回时，列表页从缓存激活，保留筛选状态和滚动位置
onActivated(() => {
  console.log('[ProductList] 从缓存激活 — 筛选条件和滚动位置保留')
})
onDeactivated(() => {
  console.log('[ProductList] 被缓存 — 当前页码/筛选/滚动位置被保留')
})

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const categoryId = ref(Number(route.query.categoryId) || 0)
const sort = ref(route.query.sort || '')
const page = ref(Number(route.query.page) || 1)
const pageSize = 8

const sortOptions = [
  { value: '', label: '默认' },
  { value: 'sales', label: '销量优先' },
  { value: 'price-asc', label: '价格↑' },
  { value: 'price-desc', label: '价格↓' },
]

async function loadData() {
  await productStore.fetchProducts({ categoryId: categoryId.value, sort: sort.value, page: page.value, pageSize })
}

onMounted(() => {
  productStore.fetchCategories()
  loadData()
})

watch(() => route.query, (q) => {
  categoryId.value = Number(q.categoryId) || 0
  sort.value = q.sort || ''
  page.value = Number(q.page) || 1
  loadData()
})

function setCategory(id) {
  router.push({ query: { ...route.query, categoryId: id || undefined, page: undefined } })
}
function setSort(val) {
  router.push({ query: { ...route.query, sort: val || undefined, page: undefined } })
}
function onPageChange(p) {
  router.push({ query: { ...route.query, page: p > 1 ? p : undefined } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="product-list-page">
    <h1 class="page-title">全部商品</h1>

    <!-- 分类筛选 -->
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">分类：</span>
        <button :class="{ active: categoryId === 0 }" @click="setCategory(0)">全部</button>
        <button
          v-for="cat in productStore.categories" :key="cat.id"
          :class="{ active: categoryId === cat.id }"
          @click="setCategory(cat.id)"
        >{{ cat.name }}</button>
      </div>
      <div class="filter-row">
        <span class="filter-label">排序：</span>
        <button
          v-for="opt in sortOptions" :key="opt.value"
          :class="{ active: sort === opt.value }"
          @click="setSort(opt.value)"
        >{{ opt.label }}</button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="productStore.loading" class="loading">加载中...</div>

    <!-- 商品列表 -->
    <div v-else-if="productStore.list.length" class="product-grid">
      <ProductCard
        v-for="product in productStore.list"
        :key="product.id"
        :product="product"
      />
    </div>
    <div v-else class="empty">暂无商品</div>

    <!-- 分页 -->
    <Pagination
      :page="page"
      :total-pages="Math.ceil(productStore.total / pageSize)"
      @change="onPageChange"
    />
  </div>
</template>

<style scoped>
.product-list-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-title { font-size: 24px; font-weight: 700; color: #333; margin: 0 0 20px; }

.filter-bar { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #f0f0f0; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.filter-row:last-child { margin-bottom: 0; }
.filter-label { font-size: 14px; color: #666; font-weight: 500; min-width: 50px; }
.filter-row button {
  padding: 6px 14px; border: 1px solid #e0e0e0; border-radius: 16px;
  background: #fff; font-size: 13px; color: #666; cursor: pointer; transition: all 0.2s;
}
.filter-row button:hover { border-color: #ff4757; color: #ff4757; }
.filter-row button.active { background: #ff4757; color: #fff; border-color: #ff4757; }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.loading, .empty { text-align: center; padding: 60px 20px; color: #999; font-size: 15px; }

@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
