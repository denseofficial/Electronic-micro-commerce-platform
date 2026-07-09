<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/common/ProductCard.vue'
import { ElMessage } from 'element-plus'

// ============ KeepAlive 生命周期演示 ============
onActivated(() => {
  console.log('[Home] 从缓存激活 — 无需重新加载数据')
})
onDeactivated(() => {
  console.log('[Home] 被缓存 — 滚动位置和轮播状态保留')
})

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

// ============ Element Plus 轮播组件替换手写轮播 ============
// 限定暖色系，贴合 Refined Commerce 红色收敛方向
const banners = ref([
  { id: 1, title: '618年中大促', subtitle: '全场低至5折', color: '#ff4757' },
  { id: 2, title: '新品首发', subtitle: '最新数码好物', color: '#ff7f50' },
  { id: 3, title: '生鲜特惠', subtitle: '新鲜直达你家', color: '#ffa502' },
])

onMounted(async () => {
  await Promise.all([
    productStore.fetchCategories(),
    productStore.fetchProducts({ pageSize: 8, sort: 'sales' }),
  ])
  console.log('[Home] 初次挂载 → 数据加载完成')
})

function goProducts(categoryId) {
  router.push({ name: 'ProductList', query: { categoryId } })
}

function quickAddToCart(product) {
  cartStore.addToCart(product)
  ElMessage.success(`已将「${product.name}」加入购物车`)
}

// v-permission 演示：admin 角色才显示"管理后台"
const isAdmin = (() => {
  try {
    return JSON.parse(localStorage.getItem('ec_mall_user') || '{}').role === 'admin'
  } catch { return false }
})()
</script>

<template>
  <div class="home">
    <!-- ============ Element Plus el-carousel 轮播 ============ -->
    <div class="banner-section">
      <el-carousel :interval="4000" arrow="hover" height="200px">
        <el-carousel-item v-for="b in banners" :key="b.id">
          <div class="banner-slide" :style="{ background: b.color }">
            <h2>{{ b.title }}</h2>
            <p>{{ b.subtitle }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类入口 -->
    <section class="section">
      <h2 class="section__title">商品分类</h2>
      <div class="categories">
        <div
          v-for="cat in productStore.categories"
          :key="cat.id"
          class="category-item"
          @click="goProducts(cat.id)"
        >
          <span class="category-icon">{{ cat.icon }}</span>
          <span class="category-name">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <!-- 热销推荐（使用 ProductCard 插槽） -->
    <section class="section">
      <h2 class="section__title">🔥 热销推荐</h2>
      <div class="product-grid">
        <ProductCard
          v-for="product in productStore.list"
          :key="product.id"
          :product="product"
        >
          <!--
            ============ 具名插槽 #tags 演示 ============
            使用 el-tag 替代默认标签，传入自定义内容
          -->
          <template #tags>
            <el-tag
              v-if="product.isHot"
              type="danger"
              size="small"
              effect="dark"
              style="position: absolute; top: 8px; right: 8px;"
            >🔥 热卖</el-tag>
            <el-tag
              v-if="product.isNew"
              type="success"
              size="small"
              effect="dark"
              style="position: absolute; top: 8px; left: 8px;"
            >新品</el-tag>
          </template>

          <!--
            ============ 具名插槽 #footer 演示 ============
            添加快捷加购按钮
          -->
          <template #footer>
            <el-button
              type="danger"
              size="small"
              round
              @click="quickAddToCart(product)"
            >
              🛒 快捷加购
            </el-button>
          </template>
        </ProductCard>
      </div>
    </section>

    <!-- v-permission 演示 -->
    <div v-if="isAdmin" class="admin-entry">
      <el-button type="primary" @click="router.push('/')">
        ⚙️ 进入管理后台（仅管理员可见）
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.home { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Banner */
.banner-section { border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 40px; }

.banner-slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 48px;
  color: #fff;
  background-image: linear-gradient(120deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0));
}

.banner-slide h2 { font-size: 38px; margin: 0 0 10px; color: #fff; font-weight: 700; letter-spacing: 0.01em; }
.banner-slide p { font-size: 18px; margin: 0; opacity: 0.92; }

/* Section */
.section { margin-bottom: 40px; }
.section__title {
  font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary);
  margin: 0 0 20px; padding-left: 12px; border-left: 3px solid var(--primary);
  line-height: 1.2;
}

/* Categories */
.categories {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px;
}
.category-item {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 22px 8px; background: var(--bg-white); border-radius: var(--radius-md);
  cursor: pointer; border: 1px solid var(--border);
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}
.category-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}
.category-icon { font-size: 32px; }
.category-name { font-size: 13px; color: var(--text-primary); font-weight: 500; }

/* Product Grid */
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.admin-entry { text-align: center; margin-top: 24px; }

@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .categories { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .categories { grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .banner-slide { padding: 0 24px; }
  .banner-slide h2 { font-size: 28px; }
}
</style>
