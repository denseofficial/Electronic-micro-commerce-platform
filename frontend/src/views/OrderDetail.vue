<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder } from '../api/orders'
import { formatPrice, formatDate, getOrderStatusText } from '../utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const order = ref(null)

onMounted(async () => {
  const res = await getOrderDetail(route.params.id)
  order.value = res.data
})

async function handleCancel() {
  try {
    await ElMessageBox.confirm('确定取消该订单吗？', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '返回',
      type: 'warning',
    })
    const res = await cancelOrder(order.value.id)
    order.value = res.data
    ElMessage.success('订单已取消')
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('取消失败：' + (e.message || '未知错误'))
    }
  }
}
</script>

<template>
  <div v-if="order" class="order-detail">
    <button class="back-btn" @click="router.back()">← 返回</button>
    <h1 class="page-title">订单详情</h1>

    <!-- 状态 -->
    <div class="status-bar" :class="order.status">
      <span class="status-text">{{ getOrderStatusText(order.status) }}</span>
      <button v-if="order.status === 'pending'" class="cancel-btn" @click="handleCancel">取消订单</button>
    </div>

    <!-- 收货信息 -->
    <section class="section">
      <h3>收货信息</h3>
      <p><strong>{{ order.address?.name }}</strong> {{ order.address?.mobile }}</p>
      <p class="addr">{{ order.address?.full }}</p>
    </section>

    <!-- 商品清单 -->
    <section class="section">
      <h3>商品清单</h3>
      <div v-for="item in order.items" :key="item.productId" class="item">
        <img :src="item.image" :alt="item.name" />
        <div class="item-info">
          <h4>{{ item.name }}</h4>
          <span>{{ formatPrice(item.price) }} × {{ item.quantity }}</span>
        </div>
        <span class="item-total">{{ formatPrice(item.price * item.quantity) }}</span>
      </div>
    </section>

    <!-- 订单信息 -->
    <section class="section">
      <h3>订单信息</h3>
      <div class="info-grid">
        <span>订单编号</span><span>{{ order.id }}</span>
        <span>创建时间</span><span>{{ formatDate(order.createTime) }}</span>
        <span v-if="order.payTime">付款时间</span><span v-if="order.payTime">{{ formatDate(order.payTime) }}</span>
        <span v-if="order.shipTime">发货时间</span><span v-if="order.shipTime">{{ formatDate(order.shipTime) }}</span>
        <span>应付金额</span><span class="price">{{ formatPrice(order.totalAmount) }}</span>
      </div>
    </section>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<style scoped>
.order-detail { animation: fadeIn 0.4s ease; max-width: 700px; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.back-btn { background: none; border: none; color: #666; cursor: pointer; padding: 0; margin-bottom: 8px; font-size: 14px; }
.back-btn:hover { color: #ff4757; }
.page-title { font-size: 22px; font-weight: 700; color: #333; margin: 0 0 16px; }

.status-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; border-radius: 12px; margin-bottom: 16px;
  background: #fff3f3; border: 1px solid #ffcccc;
}
.status-bar.completed { background: #f0fff4; border-color: #c6f6d5; }
.status-bar.cancelled { background: #f5f5f5; border-color: #e0e0e0; }
.status-text { font-size: 18px; font-weight: 600; color: #ff4757; }
.status-bar.completed .status-text { color: #2ed573; }
.status-bar.cancelled .status-text { color: #999; }
.cancel-btn { padding: 8px 16px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-size: 13px; }

.section {
  background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 16px;
}
.section h3 { font-size: 16px; font-weight: 600; color: #333; margin: 0 0 12px; }
.section p { margin: 4px 0; font-size: 14px; }
.addr { color: #666; }

.item { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
.item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
.item-info { flex: 1; }
.item-info h4 { font-size: 14px; color: #333; margin: 0 0 4px; }
.item-info span { font-size: 12px; color: #999; }
.item-total { font-size: 14px; font-weight: 600; }

.info-grid {
  display: grid; grid-template-columns: auto 1fr;
  gap: 8px 20px; font-size: 14px;
}
.info-grid span:nth-child(odd) { color: #999; }
.info-grid span:nth-child(even) { color: #333; }
.price { color: #ff4757; font-size: 18px; font-weight: 700; }

.loading { text-align: center; padding: 80px; color: #999; }
</style>
