<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { formatPrice, formatDate } from '../utils/format'
import { getReviews, createReview } from '../api/reviews'
import StarRating from '../components/common/StarRating.vue'
import ProductSpecTable from '../components/product/ProductSpecTable.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = computed(() => productStore.currentProduct)
const currentImage = ref(0)
const quantity = ref(1)
const addingToCart = ref(false)

const reviewsData = ref({ items: [], average: 0, total: 0 })
const reviewForm = ref({ rating: 5, content: '' })
const submittingReview = ref(false)

onMounted(async () => {
  const id = route.params.id
  await productStore.fetchProductDetail(id)
  currentImage.value = 0
  quantity.value = 1
  await loadReviews(id)
})

async function loadReviews(id) {
  const res = await getReviews(id)
  reviewsData.value = res.data
}

async function submitReview() {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录后再评价')
    router.push({ name: 'Login', query: { redirect: `/product/${route.params.id}` } })
    return
  }
  if (reviewForm.value.content.trim().length < 1) {
    ElMessage.warning('请输入评价内容')
    return
  }
  submittingReview.value = true
  try {
    const res = await createReview(route.params.id, {
      rating: reviewForm.value.rating,
      content: reviewForm.value.content.trim(),
    })
    ElMessage.success('评价成功')
    reviewForm.value = { rating: 5, content: '' }
    await loadReviews(route.params.id)
    // 同步更新商品详情的评分聚合
    if (productStore.currentProduct) {
      productStore.currentProduct.rating = res.data.average
      productStore.currentProduct.reviews = res.data.total
    }
  } catch (e) {
    ElMessage.error('评价失败：' + (e.response?.data?.message || e.message || '未知错误'))
  } finally {
    submittingReview.value = false
  }
}

function goBack() {
  router.back()
}

async function addToCart() {
  if (!product.value) return
  addingToCart.value = true
  try {
    await cartStore.addToCart(product.value, quantity.value)
    ElMessage.success('已加入购物车！')
  } finally {
    addingToCart.value = false
  }
}

function buyNow() {
  addToCart()
  router.push({ name: 'Cart' })
}
</script>

<template>
  <div v-if="product" class="detail">
    <button class="back-btn" @click="goBack">← 返回</button>

    <div class="detail__main">
      <!-- 商品图片 -->
      <div class="detail__gallery">
        <img :src="product.images?.[currentImage] || product.image" :alt="product.name" class="main-img" />
        <div v-if="product.images?.length > 1" class="thumb-list">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            :class="{ active: idx === currentImage }"
            @click="currentImage = idx"
          />
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="detail__info">
        <h1>{{ product.name }}</h1>
        <p class="desc">{{ product.description }}</p>

        <div class="price-row">
          <span class="price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice > product.price" class="original">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <div class="meta">
          <span>销量：{{ product.sales }}</span>
          <StarRating :rating="product.rating" />
          <span>{{ product.reviews }} 条评价</span>
          <span>库存：{{ product.stock }} 件</span>
        </div>

        <!-- 规格 -->
        <div v-if="product.specs" class="specs">
          <h4>规格参数</h4>
          <ProductSpecTable :specs="product.specs" />
        </div>

        <!-- 数量 -->
        <div class="qty-row">
          <span>数量</span>
          <div class="qty-ctrl">
            <button :disabled="quantity <= 1" @click="quantity--">−</button>
            <input type="number" v-model.number="quantity" min="1" :max="product.stock" />
            <button :disabled="quantity >= product.stock" @click="quantity++">+</button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <button class="btn btn--cart" :disabled="addingToCart" @click="addToCart">
            🛒 加入购物车
          </button>
          <button class="btn btn--buy" @click="buyNow">
            ⚡ 立即购买
          </button>
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <section class="reviews">
      <div class="reviews__head">
        <h2>商品评价</h2>
        <div class="reviews__summary">
          <StarRating :rating="reviewsData.average" />
          <span class="reviews__score">{{ reviewsData.average }}</span>
          <span class="reviews__count">{{ reviewsData.total }} 条评价</span>
        </div>
      </div>

      <div v-if="authStore.isLoggedIn" class="review-form">
        <div class="star-input">
          <span
            v-for="n in 5"
            :key="n"
            class="star-opt"
            :class="{ active: n <= reviewForm.rating }"
            @click="reviewForm.rating = n"
          >★</span>
          <span class="star-input__hint">点击评分</span>
        </div>
        <el-input
          v-model="reviewForm.content"
          type="textarea"
          :rows="3"
          maxlength="500"
          show-word-limit
          placeholder="说说你对这件商品的使用感受～"
        />
        <button class="review-submit" :disabled="submittingReview" @click="submitReview">
          {{ submittingReview ? '提交中...' : '发表评价' }}
        </button>
      </div>
      <p v-else class="review-login-tip">
        登录后可发表评价 ·
        <router-link :to="{ name: 'Login', query: { redirect: $route.fullPath } }">去登录</router-link>
      </p>

      <ul v-if="reviewsData.items.length" class="review-list">
        <li v-for="rv in reviewsData.items" :key="rv.id" class="review-item">
          <div class="review-item__head">
            <span class="review-item__user">{{ rv.nickname }}</span>
            <StarRating :rating="rv.rating" />
          </div>
          <p class="review-item__content">{{ rv.content }}</p>
          <span class="review-item__time">{{ formatDate(rv.createTime) }}</span>
        </li>
      </ul>
      <p v-else class="review-empty">暂无评价，快来抢沙发～</p>
    </section>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<style scoped>
.detail { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  transition: color var(--dur-1) var(--ease-out);
}
.back-btn:hover { color: var(--primary); }

.detail__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 28px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

/* Gallery */
.main-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--surface-2);
}
.thumb-list {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.thumb-list img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color var(--dur-1) var(--ease-out);
}
.thumb-list img.active { border-color: var(--primary); }

/* Info */
.detail__info h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
}
.desc { font-size: 14px; color: var(--text-muted); margin: 0 0 16px; }

.price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
.price { font-size: 28px; font-weight: 700; color: var(--primary); }
.original { font-size: 16px; color: var(--text-placeholder); text-decoration: line-through; }

.meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 16px;
  font-size: 13px; color: var(--text-muted); padding: 12px 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);
  margin-bottom: 16px;
}

.specs { margin-bottom: 16px; }
.specs h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 8px; }

.qty-row {
  display: flex; align-items: center; gap: 20px; margin-bottom: 20px;
  font-size: 14px; color: var(--text-primary);
}
.qty-ctrl { display: flex; align-items: center; }
.qty-ctrl button {
  width: 32px; height: 32px; border: 1px solid var(--border); background: var(--surface-2);
  font-size: 16px; cursor: pointer; transition: background-color var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out), border-color var(--dur-1) var(--ease-out);
}
.qty-ctrl button:hover:not(:disabled) { background: var(--primary); color: #fff; border-color: var(--primary); }
.qty-ctrl button:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-ctrl button:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.qty-ctrl button:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.qty-ctrl input {
  width: 48px; height: 32px; text-align: center; border: 1px solid var(--border); border-left: none; border-right: none;
  font-size: 14px; outline: none;
}

.actions { display: flex; gap: 12px; }
.btn {
  flex: 1; padding: 14px; border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 600;
  cursor: pointer; transition: background-color var(--dur-2) var(--ease-out), color var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out);
}
.btn--cart { background: var(--primary-bg); color: var(--primary); border: 1px solid var(--primary); }
.btn--cart:hover { background: var(--primary); color: #fff; }
.btn--buy { background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: #fff; }
.btn--buy:hover { transform: translateY(-1px); box-shadow: var(--shadow-brand); }

.loading { text-align: center; padding: 80px; color: var(--text-muted); }

/* Reviews */
.reviews {
  margin-top: 24px; background: var(--bg-white); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px;
}
.reviews__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.reviews__head h2 { font-size: var(--text-lg); font-weight: 700; color: var(--text-primary); margin: 0; }
.reviews__summary { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
.reviews__score { color: var(--warning); font-weight: 700; font-size: 16px; }

.review-form { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: var(--surface-2); border-radius: var(--radius-md); margin-bottom: 16px; }
.star-input { display: flex; align-items: center; gap: 4px; }
.star-opt { font-size: 24px; color: var(--border); cursor: pointer; transition: color var(--dur-1) var(--ease-out); }
.star-opt.active { color: var(--warning); }
.star-input__hint { margin-left: 8px; font-size: 12px; color: var(--text-muted); }
.review-submit {
  align-self: flex-end; padding: 10px 28px; border: none; border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: #fff;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out);
}
.review-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-brand); }
.review-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.review-login-tip { font-size: 14px; color: var(--text-muted); padding: 16px; background: var(--surface-2); border-radius: var(--radius-md); margin: 0 0 16px; }
.review-login-tip a { color: var(--primary); text-decoration: none; }

.review-list { list-style: none; padding: 0; margin: 0; }
.review-item { padding: 16px 0; border-bottom: 1px solid var(--border-light); }
.review-item:last-child { border-bottom: none; }
.review-item__head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.review-item__user { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.review-item__content { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 6px; white-space: pre-wrap; }
.review-item__time { font-size: 12px; color: var(--text-muted); }
.review-empty { text-align: center; color: var(--text-muted); padding: 24px 0; font-size: 14px; }

@media (max-width: 768px) {
  .detail__main { grid-template-columns: 1fr; }
}
</style>
