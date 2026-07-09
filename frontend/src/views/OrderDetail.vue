<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder, shipOrder, confirmReceive } from '../api/orders'
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

async function handleShip() {
  try {
    const res = await shipOrder(order.value.id)
    order.value = res.data
    ElMessage.success('已发货')
  } catch (e) {
    ElMessage.error('发货失败：' + (e.response?.data?.message || e.message || '未知错误'))
  }
}

async function handleReceive() {
  try {
    const res = await confirmReceive(order.value.id)
    order.value = res.data
    ElMessage.success('已确认收货')
  } catch (e) {
    ElMessage.error('操作失败：' + (e.response?.data?.message || e.message || '未知错误'))
  }
}
</script>

<template>
  <div v-if="order" class="order-detail">
    <button class="back-btn" @click="router.back()">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
      返回
    </button>
    <h1 class="page-title">订单详情</h1>

    <!-- 状态 -->
    <div class="status-bar" :class="order.status">
      <span class="status-text">
        <span class="status-dot"></span>
        {{ getOrderStatusText(order.status) }}
      </span>
      <div class="status-actions">
        <button v-if="order.status === 'pending'" class="btn btn--ghost cancel-btn" @click="handleCancel">取消订单</button>
        <button v-if="order.status === 'paid'" class="btn btn--ghost ship-btn" @click="handleShip">发货（演示）</button>
        <button v-if="order.status === 'shipped'" class="btn btn--primary receive-btn" @click="handleReceive">确认收货</button>
      </div>
    </div>

    <!-- 收货信息 -->
    <section class="detail-card glass">
      <h3 class="card-title">收货信息</h3>
      <p class="receiver"><strong>{{ order.address?.name }}</strong> <span class="mobile">{{ order.address?.mobile }}</span></p>
      <p class="addr">{{ order.address?.full }}</p>
    </section>

    <!-- 商品清单 -->
    <section class="detail-card glass">
      <h3 class="card-title">商品清单</h3>
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
    <section class="detail-card glass">
      <h3 class="card-title">订单信息</h3>
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
.order-detail { animation: fadeIn 0.4s ease; max-width: 700px; margin: 0 auto; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-btn {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--glass-bg); border: 1px solid var(--glass-border);
  -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur));
  color: var(--text-secondary); cursor: pointer; padding: 7px 14px; margin-bottom: 12px;
  border-radius: var(--radius-xl); font-size: 13px; font-weight: 500;
  transition: color var(--dur-1) var(--ease-out), border-color var(--dur-1) var(--ease-out);
}
.back-btn:hover { color: var(--primary); border-color: var(--primary-light); }

.page-title { font-size: var(--text-2xl); font-weight: 800; color: var(--text-primary); margin: 0 0 16px; }

.status-bar {
  --st: var(--primary);
  display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 16px 20px; border-radius: var(--radius-md); margin-bottom: 16px;
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  border-left: 4px solid var(--st);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.status-bar.pending { --st: var(--primary); }
.status-bar.paid { --st: var(--warning); }
.status-bar.shipped { --st: #ff7f50; }
.status-bar.completed { --st: #2ed573; }
.status-bar.cancelled { --st: var(--text-muted); }
.status-text {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: var(--text-lg); font-weight: 700; color: var(--st);
}
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--st); box-shadow: 0 0 0 4px color-mix(in srgb, var(--st) 22%, transparent); }
.status-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.detail-card {
  border-radius: var(--radius-md); padding: 20px; margin-bottom: 16px; font-size: 14px;
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.card-title {
  display: flex; align-items: center;
  font-size: var(--text-lg); font-weight: 700; color: var(--text-primary); margin: 0 0 14px;
  padding-left: 12px; position: relative;
}
.card-title::before {
  content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 4px; height: 16px; border-radius: 2px; background: var(--brand-gradient);
}
.detail-card p { margin: 4px 0; }
.receiver { font-size: 15px; color: var(--text-primary); }
.receiver strong { font-weight: 700; }
.mobile { color: var(--text-secondary); margin-left: 8px; }
.addr { color: var(--text-secondary); }

.item { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--border-light); }
.item:last-child { border-bottom: none; padding-bottom: 0; }
.item img { width: 64px; height: 64px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; box-shadow: var(--shadow-sm); }
.item-info { flex: 1; min-width: 0; }
.item-info h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
.item-info span { font-size: 13px; color: var(--text-muted); }
.item-total { font-size: 15px; font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; white-space: nowrap; }

.info-grid {
  display: grid; grid-template-columns: auto 1fr;
  gap: 10px 20px; font-size: 14px;
}
.info-grid span:nth-child(odd) { color: var(--text-muted); }
.info-grid span:nth-child(even) { color: var(--text-primary); text-align: right; }
.price { color: var(--primary) !important; font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }

.loading { text-align: center; padding: 80px; color: var(--text-muted); }

@media (max-width: 768px) {
  .status-bar { flex-direction: column; align-items: flex-start; }
  .status-actions { width: 100%; }
  .status-actions .btn { flex: 1; }
}
</style>
