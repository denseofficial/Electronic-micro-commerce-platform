<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { getProducts, getCategories } from '../api/products'
import { formatPrice } from '../utils/format'

const loading = ref(false)
const products = ref([])
const categories = ref([])
const activeCategoryId = ref(0)
const lastUpdatedAt = ref('')
let refreshTimer = null

const categoryNameMap = computed(() => {
  const map = new Map()
  categories.value.forEach((cat) => map.set(cat.id, cat.name))
  return map
})

const totalSales = computed(() => products.value.reduce((sum, item) => sum + item.sales, 0))
const totalStock = computed(() => products.value.reduce((sum, item) => sum + item.stock, 0))
const averageRating = computed(() => {
  if (!products.value.length) return '0.0'
  const total = products.value.reduce((sum, item) => sum + item.rating, 0)
  return (total / products.value.length).toFixed(1)
})
const averagePrice = computed(() => {
  if (!products.value.length) return 0
  return products.value.reduce((sum, item) => sum + item.price, 0) / products.value.length
})

const categoryStats = computed(() => {
  const stats = categories.value.map((cat) => {
    const list = products.value.filter((item) => item.categoryId === cat.id)
    const sales = list.reduce((sum, item) => sum + item.sales, 0)
    const stock = list.reduce((sum, item) => sum + item.stock, 0)
    const ratio = totalSales.value ? Math.round((sales / totalSales.value) * 100) : 0
    return {
      id: cat.id,
      name: cat.name,
      count: list.length,
      sales,
      stock,
      ratio,
    }
  })
  return stats.sort((a, b) => b.sales - a.sales)
})

const topProducts = computed(() => {
  return [...products.value]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      categoryName: categoryNameMap.value.get(item.categoryId) || '未分类',
    }))
})

const filteredProducts = computed(() => {
  if (!activeCategoryId.value) return products.value
  return products.value.filter((item) => item.categoryId === activeCategoryId.value)
})

const selectedCategoryName = computed(() => {
  if (!activeCategoryId.value) return '全部分类'
  return categoryNameMap.value.get(activeCategoryId.value) || '未知分类'
})

const viewSummary = computed(() => {
  const sales = filteredProducts.value.reduce((sum, item) => sum + item.sales, 0)
  return {
    count: filteredProducts.value.length,
    sales,
    stock: filteredProducts.value.reduce((sum, item) => sum + item.stock, 0),
  }
})

async function loadStats() {
  loading.value = true
  try {
    const [productRes, categoryRes] = await Promise.all([
      getProducts({ page: 1, pageSize: 1000, sort: 'sales' }),
      getCategories(),
    ])
    products.value = productRes.data.items
    categories.value = categoryRes.data
    lastUpdatedAt.value = new Date().toLocaleString()
  } finally {
    loading.value = false
  }
}

watch(
  activeCategoryId,
  (id) => {
    console.log(`[DataStats] 当前统计视图切换为：${id || '全部分类'}`)
  },
  { immediate: true },
)

onMounted(() => {
  loadStats()
  refreshTimer = window.setInterval(() => {
    console.log('[DataStats] 定时器存活，用于演示页面销毁清理逻辑')
  }, 30000)
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<template>
  <div class="stats-page">
    <div class="page-head">
      <div>
        <h1 class="page-title">数据统计</h1>
        <p class="page-subtitle">
          基于商品接口数据计算销量、库存、评分和分类分布，展示 computed、watch 与生命周期逻辑。
        </p>
      </div>
      <el-button type="danger" :loading="loading" @click="loadStats">刷新统计</el-button>
    </div>

    <el-skeleton v-if="loading && !products.length" :rows="8" animated />

    <template v-else>
      <div class="stat-grid">
        <el-card class="stat-card" shadow="hover">
          <el-statistic title="商品总数" :value="products.length" suffix="件" />
        </el-card>
        <el-card class="stat-card" shadow="hover">
          <el-statistic title="累计销量" :value="totalSales" suffix="单" />
        </el-card>
        <el-card class="stat-card" shadow="hover">
          <el-statistic title="平均评分" :value="averageRating" suffix="分" />
        </el-card>
        <el-card class="stat-card" shadow="hover">
          <el-statistic title="平均价格" :value="averagePrice" prefix="￥" :precision="2" />
        </el-card>
      </div>

      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>分类统计</span>
            <small>最后更新：{{ lastUpdatedAt || '尚未加载' }}</small>
          </div>
        </template>

        <div class="category-tabs">
          <el-button
            :type="activeCategoryId === 0 ? 'danger' : 'default'"
            round
            @click="activeCategoryId = 0"
          >
            全部
          </el-button>
          <el-button
            v-for="cat in categories"
            :key="cat.id"
            :type="activeCategoryId === cat.id ? 'danger' : 'default'"
            round
            @click="activeCategoryId = cat.id"
          >
            {{ cat.name }}
          </el-button>
        </div>

        <div class="view-summary">
          <el-tag type="danger" effect="plain">{{ selectedCategoryName }}</el-tag>
          <span>商品 {{ viewSummary.count }} 件</span>
          <span>销量 {{ viewSummary.sales }} 单</span>
          <span>库存 {{ viewSummary.stock }} 件</span>
        </div>

        <el-table :data="categoryStats" stripe>
          <el-table-column prop="name" label="分类" min-width="120" />
          <el-table-column prop="count" label="商品数" width="100" />
          <el-table-column prop="sales" label="销量" width="120" sortable />
          <el-table-column prop="stock" label="库存" width="120" sortable />
          <el-table-column label="销量占比" min-width="180">
            <template #default="{ row }">
              <el-progress :percentage="row.ratio" :stroke-width="12" color="#ff4757" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>热销商品 Top 5</span>
            <small>总库存：{{ totalStock }} 件</small>
          </div>
        </template>

        <el-table :data="topProducts" stripe>
          <el-table-column prop="rank" label="排名" width="80" />
          <el-table-column prop="name" label="商品名称" min-width="220" />
          <el-table-column prop="categoryName" label="分类" width="130" />
          <el-table-column label="价格" width="120">
            <template #default="{ row }">{{ formatPrice(row.price) }}</template>
          </el-table-column>
          <el-table-column prop="sales" label="销量" width="120" sortable />
          <el-table-column prop="rating" label="评分" width="100" sortable />
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.stats-page {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
}

.page-subtitle {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.stat-card {
  border-radius: 8px;
}

.section-card {
  border-radius: 8px;
  margin-bottom: 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.card-header small {
  color: #999;
  font-weight: 400;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.view-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  color: #666;
  margin-bottom: 14px;
}

@media (max-width: 900px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-head {
    flex-direction: column;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
