<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/format'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchCart()
})

function goCheckout() {
  if (cartStore.checkedItems.length === 0) {
    ElMessage.warning('请先选择商品')
    return
  }
  router.push({ name: 'Checkout' })
}

function goProduct(id) {
  router.push({ name: 'ProductDetail', params: { id } })
}
</script>

<template>
  <div class="cart-page">
    <h1 class="page-title">🛒 我的购物车</h1>

    <div v-if="cartStore.items.length" class="cart-content">
      <div class="cart-list">
        <!-- 全选 -->
        <div class="cart-toolbar">
          <label class="check-all">
            <input
              type="checkbox"
              :checked="cartStore.isAllChecked"
              @change="cartStore.toggleAll(($event.target).checked)"
            />
            <span>全选</span>
          </label>
          <button
            v-if="cartStore.checkedItems.length"
            class="clear-btn"
            @click="cartStore.clearChecked()"
          >删除选中</button>
        </div>

        <!-- 商品列表 -->
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="cart-item"
        >
          <input
            type="checkbox"
            :checked="item.checked"
            @change="cartStore.toggleCheck(item.productId)"
          />
          <img :src="item.image" :alt="item.name" @click="goProduct(item.productId)" />
          <div class="item-info">
            <h4 @click="goProduct(item.productId)">{{ item.name }}</h4>
            <p v-if="item.specs" class="item-specs">{{ item.specs }}</p>
            <span class="item-price">{{ formatPrice(item.price) }}</span>
          </div>
          <div class="qty-ctrl">
            <button :disabled="item.quantity <= 1" @click="cartStore.updateQuantity(item.productId, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button :disabled="item.quantity >= item.stock" @click="cartStore.updateQuantity(item.productId, item.quantity + 1)">+</button>
          </div>
          <span class="item-subtotal">{{ formatPrice(item.price * item.quantity) }}</span>
          <button class="del-btn" @click="cartStore.removeItem(item.productId)">🗑</button>
        </div>
      </div>

      <!-- 汇总栏 -->
      <div class="cart-summary">
        <div class="summary-row">
          <span>已选商品 <strong>{{ cartStore.checkedCount }}</strong> 件</span>
          <span class="summary-total">
            合计：<strong>{{ formatPrice(cartStore.totalPrice) }}</strong>
          </span>
        </div>
        <button class="checkout-btn" @click="goCheckout">
          去结算
        </button>
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>🛒</p>
      <h3>购物车为空</h3>
      <button @click="router.push({ name: 'ProductList' })">去逛逛</button>
    </div>
  </div>
</template>

<style scoped>
.cart-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-title { font-size: 24px; font-weight: 700; color: #333; margin: 0 0 20px; }

.cart-content { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }

/* Toolbar */
.cart-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; background: #fff; border-radius: 12px; margin-bottom: 12px;
}
.check-all { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
.clear-btn { background: none; border: none; color: #ff4757; cursor: pointer; font-size: 14px; }

/* Cart Items */
.cart-list { display: flex; flex-direction: column; gap: 12px; }

.cart-item {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; background: #fff; border-radius: 12px;
}
.cart-item img {
  width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer;
}
.item-info { flex: 1; min-width: 0; }
.item-info h4 {
  font-size: 14px; font-weight: 600; color: #333; margin: 0; cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.item-info h4:hover { color: #ff4757; }
.item-specs { font-size: 12px; color: #999; margin: 4px 0; }
.item-price { font-size: 16px; font-weight: 700; color: #ff4757; }

.qty-ctrl {
  display: flex; align-items: center; gap: 8px;
}
.qty-ctrl button {
  width: 28px; height: 28px; border: 1px solid #e0e0e0; background: #f5f5f5;
  border-radius: 50%; font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.qty-ctrl button:hover:not(:disabled) { background: #ff4757; color: #fff; border-color: #ff4757; }
.qty-ctrl button:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-ctrl span { font-size: 14px; min-width: 24px; text-align: center; }

.item-subtotal { font-size: 16px; font-weight: 600; color: #333; white-space: nowrap; }
.del-btn { background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; transition: opacity 0.2s; }
.del-btn:hover { opacity: 1; }

/* Summary */
.cart-summary {
  background: #fff; border-radius: 12px; padding: 20px;
  position: sticky; top: 80px;
}
.summary-row {
  display: flex; justify-content: space-between;
  font-size: 14px; color: #666; margin-bottom: 16px; padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.summary-total strong { font-size: 22px; color: #ff4757; }
.checkout-btn {
  width: 100%; padding: 14px; background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff; border: none; border-radius: 8px; font-size: 18px; font-weight: 600;
  cursor: pointer; transition: opacity 0.3s;
}
.checkout-btn:hover { opacity: 0.9; }

/* Empty */
.empty-cart { text-align: center; padding: 80px 20px; }
.empty-cart p { font-size: 64px; margin: 0; }
.empty-cart h3 { font-size: 18px; color: #666; margin: 16px 0; }
.empty-cart button {
  padding: 10px 32px; background: #ff4757; color: #fff;
  border: none; border-radius: 8px; font-size: 15px; cursor: pointer;
}

@media (max-width: 768px) {
  .cart-content { grid-template-columns: 1fr; }
}
</style>
