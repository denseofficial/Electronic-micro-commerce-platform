<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/common/ProductCard.vue'
import BrandMarquee from '../components/vuebits/BrandMarquee.vue'
import HorizontalRail from '../components/common/HorizontalRail.vue'
import HeroAurora from '../components/vuebits/HeroAurora.vue'
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

// ============ Element Plus el-carousel 轮播组件（品牌化 Hero） ============
const banners = ref([
  { id: 1, eyebrow: '限时狂欢', title: '618 年中大促', subtitle: '全场低至 5 折，好物闭眼入', cta: '立即抢购' },
  { id: 2, eyebrow: '新品首发', title: '最新数码好物', subtitle: '前沿科技，先人一步尝鲜', cta: '去看看' },
  { id: 3, eyebrow: '生鲜直达', title: '当季鲜货特惠', subtitle: '产地直发，新鲜到你家', cta: '马上挑' },
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
function goShop() {
  router.push({ name: 'ProductList' })
}

function quickAddToCart(product) {
  cartStore.addToCart(product)
  ElMessage.success(`已将「${product.name}」加入购物车`)
}

// v-permission 演示：admin 角色才显示"管理后台"
const isAdmin = (() => {
  try {
    return JSON.parse(localStorage.getItem('ec_mall_user') || '{}').role === 'admin'
  } catch {
    return false
  }
})()
</script>

<template>
  <div class="home">
    <!-- ============ 品牌化 Hero（el-carousel + 极光背景） ============ -->
    <section class="hero">
      <HeroAurora :blobs="3" />
      <div class="hero__carousel">
        <el-carousel :interval="4500" arrow="hover" height="300px" trigger="click">
          <el-carousel-item v-for="b in banners" :key="b.id">
            <div class="hero-slide">
              <span class="hero-slide__eyebrow">{{ b.eyebrow }}</span>
              <h2 class="hero-slide__title">{{ b.title }}</h2>
              <p class="hero-slide__subtitle">{{ b.subtitle }}</p>
              <button class="btn btn--primary hero-slide__cta" @click="goShop">
                {{ b.cta }}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- 品牌跑马灯：增加节奏与活力，破网格单调 -->
    <BrandMarquee :items="['APPLE', 'SONY', 'DYSON', 'XIAOMI', 'HUAWEI', 'NINTENDO', 'SAMSUNG']" />

    <!-- 分类入口 -->
    <section class="section" v-reveal>
      <div class="section__head">
        <h2 class="section__title">逛分类</h2>
        <router-link class="section__more" :to="{ name: 'ProductList' }">全部分类 ›</router-link>
      </div>
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
    <section class="section" v-reveal>
      <div class="section__head">
        <h2 class="section__title">热销推荐</h2>
        <router-link class="section__more" :to="{ name: 'ProductList' }">查看更多 ›</router-link>
      </div>
      <div class="product-grid">
        <ProductCard
          v-for="product in productStore.list"
          :key="product.id"
          :product="product"
          @add="quickAddToCart"
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
              class="card-tag card-tag--hot"
            >热卖</el-tag>
            <el-tag
              v-if="product.isNew"
              type="success"
              size="small"
              effect="dark"
              class="card-tag card-tag--new"
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
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              快捷加购
            </el-button>
          </template>
        </ProductCard>
      </div>
    </section>

    <!-- 横滑货架：编辑式排版，破统一竖向网格 -->
    <HorizontalRail title="为你推荐" more="查看更多 ›" v-reveal>
      <ProductCard
        v-for="p in productStore.list"
        :key="'rec' + p.id"
        :product="p"
        @add="quickAddToCart"
      />
    </HorizontalRail>

    <!-- v-permission 演示 -->
    <div v-if="isAdmin" class="admin-entry">
      <el-button type="primary" @click="router.push('/')">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        进入管理后台（仅管理员可见）
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

/* Hero */
.hero {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 24px;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-md);
}

.hero__carousel {
  position: relative;
  z-index: 1;
}

.hero-slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 56px;
  color: #fff;
}
.hero-slide__eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.92;
  margin-bottom: 10px;
}
.hero-slide__title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  margin: 0 0 12px;
  color: #fff;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
}
.hero-slide__subtitle {
  font-size: clamp(14px, 1.6vw, 18px);
  margin: 0 0 24px;
  opacity: 0.94;
}
.hero-slide__cta {
  background: #fff !important;
  color: var(--primary) !important;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18) !important;
}
.hero-slide__cta:hover {
  transform: translateY(-1px);
}

/* Categories */
.categories {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}
.category-item {
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 8px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}
.category-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}
.category-icon {
  font-size: 32px;
  line-height: 1;
}
.category-name {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.card-tag {
  position: absolute;
  top: 8px;
}
.card-tag--hot {
  right: 8px;
}
.card-tag--new {
  left: 8px;
}

.admin-entry {
  text-align: center;
  margin-top: 24px;
}
.admin-entry :deep(.el-button) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .categories {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .categories {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .hero-slide {
    padding: 0 28px;
  }
}
</style>
