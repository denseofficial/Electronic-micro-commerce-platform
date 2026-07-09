<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/format'
import StarRating from '../components/common/StarRating.vue'
import ProductSpecTable from '../components/product/ProductSpecTable.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = computed(() => productStore.currentProduct)
const currentImage = ref(0)
const quantity = ref(1)
const addingToCart = ref(false)

onMounted(async () => {
  const id = route.params.id
  await productStore.fetchProductDetail(id)
  currentImage.value = 0
  quantity.value = 1
})

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
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
}
.back-btn:hover { color: #ff4757; }

.detail__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

/* Gallery */
.main-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  background: #f9f9f9;
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
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}
.thumb-list img.active { border-color: #ff4757; }

/* Info */
.detail__info h1 {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
}
.desc { font-size: 14px; color: #999; margin: 0 0 16px; }

.price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
.price { font-size: 28px; font-weight: 700; color: #ff4757; }
.original { font-size: 16px; color: #ccc; text-decoration: line-through; }

.meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 16px;
  font-size: 13px; color: #999; padding: 12px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.specs { margin-bottom: 16px; }
.specs h4 { font-size: 14px; font-weight: 600; color: #333; margin: 0 0 8px; }

.qty-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
  font-size: 14px; color: #333;
}
.qty-ctrl { display: flex; align-items: center; }
.qty-ctrl button {
  width: 32px; height: 32px; border: 1px solid #e0e0e0; background: #f5f5f5;
  font-size: 16px; cursor: pointer; transition: all 0.2s;
}
.qty-ctrl button:hover:not(:disabled) { background: #ff4757; color: #fff; border-color: #ff4757; }
.qty-ctrl button:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-ctrl button:first-child { border-radius: 6px 0 0 6px; }
.qty-ctrl button:last-child { border-radius: 0 6px 6px 0; }
.qty-ctrl input {
  width: 48px; height: 32px; text-align: center; border: 1px solid #e0e0e0; border-left: none; border-right: none;
  font-size: 14px; outline: none;
}

.actions { display: flex; gap: 12px; }
.btn {
  flex: 1; padding: 14px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600;
  cursor: pointer; transition: all 0.3s;
}
.btn--cart { background: #fff3f3; color: #ff4757; border: 1px solid #ff4757; }
.btn--cart:hover { background: #ff4757; color: #fff; }
.btn--buy { background: linear-gradient(135deg, #ff4757, #ff6b81); color: #fff; }
.btn--buy:hover { opacity: 0.9; transform: translateY(-1px); }

.loading { text-align: center; padding: 80px; color: #999; }

@media (max-width: 768px) {
  .detail__main { grid-template-columns: 1fr; }
}
</style>
