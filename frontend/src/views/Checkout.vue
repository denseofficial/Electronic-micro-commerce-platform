<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { createOrder } from '../api/orders'
import { formatPrice } from '../utils/format'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const submitting = ref(false)

// 模拟地址（实际从 API 获取）
const address = computed(() => {
  const user = authStore.user
  if (user?.addresses?.length) {
    return user.addresses.find((a) => a.isDefault) || user.addresses[0]
  }
  return { name: '请先登录', mobile: '', full: '' }
})

async function submitOrder() {
  if (!authStore.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: '/checkout' } })
    return
  }
  submitting.value = true
  try {
    const orderData = {
      totalAmount: cartStore.totalPrice,
      items: cartStore.checkedItems.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        isFlash: i.isFlash,
      })),
      address: {
        name: address.value.name,
        mobile: address.value.mobile,
        full: `${address.value.province || ''}${address.value.city || ''}${address.value.district || ''}${address.value.detail || ''}`,
      },
    }
    const res = await createOrder(orderData)
    await cartStore.clearChecked()
    router.push({ name: 'OrderConfirm', params: { id: res.data.id } })
  } catch (e) {
    // 详细的错误提示帮助定位问题
    if (e.message?.includes('Network Error') || e.code === 'ERR_NETWORK') {
      ElMessage.error('网络连接失败！请确认后端服务已启动（cd backend && npm run dev）')
    } else if (e.response?.status === 401 || e.message?.includes('请先登录')) {
      ElMessage.error('登录已过期，请重新登录')
      router.push({ name: 'Login', query: { redirect: '/checkout' } })
    } else {
      ElMessage.error('下单失败：' + (e.message || '未知错误'))
    }
    console.error('[下单错误]', e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <h1 class="page-title">确认订单</h1>

    <!-- 收货地址 -->
    <section class="section" v-reveal>
      <h3>收货地址</h3>
      <div class="address-card">
        <p><strong>{{ address.name }}</strong> {{ address.mobile }}</p>
        <p class="addr-full">
          {{ address.province }}{{ address.city }}{{ address.district }} {{ address.detail }}
        </p>
      </div>
    </section>

    <!-- 商品清单 -->
    <section class="section" v-reveal>
      <h3>商品清单</h3>
      <div class="item-list">
        <div v-for="item in cartStore.checkedItems" :key="item.productId" class="item">
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <h4>{{ item.name }}</h4>
            <span class="item-price">{{ formatPrice(item.price) }} × {{ item.quantity }}</span>
          </div>
          <span class="item-total">{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
      </div>
    </section>

    <!-- 订单合计 -->
    <section class="section summary" v-reveal>
      <div class="summary-row">
        <span>商品合计</span>
        <span class="price">{{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
      <div class="summary-row">
        <span>运费</span>
        <span>免运费</span>
      </div>
      <div class="summary-row total">
        <span>应付总额</span>
        <span class="price">{{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
    </section>

    <button class="submit-btn" :disabled="submitting" @click="submitOrder">
      {{ submitting ? '提交中...' : '提交订单' }}
    </button>
  </div>
</template>

<style scoped>
.checkout-page { animation: fadeIn 0.4s ease; max-width: 800px; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-title { font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary); margin: 0 0 20px; }

.section {
  background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 16px;
  -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur));
}
.section h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0 0 12px; }

.address-card { font-size: 14px; color: var(--text-primary); }
.address-card p { margin: 4px 0; }
.addr-full { color: var(--text-secondary); }

.item-list { display: flex; flex-direction: column; gap: 12px; }
.item { display: flex; align-items: center; gap: 12px; }
.item img { width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); }
.item-info { flex: 1; }
.item-info h4 { font-size: 14px; font-weight: 500; color: var(--text-primary); margin: 0 0 4px; }
.item-price { font-size: 13px; color: var(--text-muted); }
.item-total { font-size: 16px; font-weight: 600; color: var(--text-primary); }

.summary { }
.summary-row {
  display: flex; justify-content: space-between; font-size: 14px; color: var(--text-secondary);
  padding: 8px 0;
}
.summary-row.total { border-top: 1px solid var(--border-light); margin-top: 8px; padding-top: 12px; font-size: 16px; font-weight: 600; color: var(--text-primary); }
.price { color: var(--primary); font-weight: 600; }

.submit-btn {
  width: 100%; padding: 16px; background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: #fff; border: none; border-radius: var(--radius-md); font-size: 18px; font-weight: 600;
  cursor: pointer; transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out), opacity var(--dur-1) var(--ease-out);
}
.submit-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-brand); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
</style>
