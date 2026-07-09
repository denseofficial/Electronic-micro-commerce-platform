<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder, payOrder } from '../api/orders'
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

async function goPay() {
  try {
    const res = await payOrder(order.value.id)
    order.value = res.data
    ElMessage.success('支付成功！')
  } catch (e) {
    ElMessage.error('支付失败：' + (e.message || '未知错误'))
  }
}
</script>

<template>
  <div v-if="order" class="order-confirm">
    <div class="result-icon" :class="order.status">
      <svg v-if="order.status === 'pending'" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
      <svg v-else-if="order.status === 'cancelled'" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
      <svg v-else viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>
    </div>

    <h1 :class="order.status">
      {{ order.status === 'pending' ? '订单已提交，请尽快付款' :
         order.status === 'cancelled' ? '订单已取消' : '支付成功！' }}
    </h1>

    <div class="info-card glass">
      <div class="info-row"><span>订单编号</span><span>{{ order.id }}</span></div>
      <div class="info-row"><span>创建时间</span><span>{{ formatDate(order.createTime) }}</span></div>
      <div class="info-row"><span>订单状态</span><span class="status-tag">{{ getOrderStatusText(order.status) }}</span></div>
      <div class="info-row"><span>应付金额</span><span class="price">{{ formatPrice(order.totalAmount) }}</span></div>
    </div>

    <div class="actions">
      <button v-if="order.status === 'pending'" class="btn btn--block btn--pay" @click="goPay">
        立即支付 {{ formatPrice(order.totalAmount) }}
      </button>
      <button v-if="order.status === 'pending'" class="btn btn--block btn--cancel" @click="handleCancel">
        取消订单
      </button>
      <button class="btn btn--block btn--orders" @click="router.push({ name: 'OrderList' })">
        查看订单列表
      </button>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<style scoped>
.order-confirm { text-align: center; animation: fadeIn 0.4s ease; max-width: 500px; margin: 0 auto; padding: 24px 0; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-icon {
  --st: var(--primary);
  display: inline-flex; align-items: center; justify-content: center;
  width: 88px; height: 88px; border-radius: 50%; margin: 8px 0 18px;
  color: var(--st);
  background: color-mix(in srgb, var(--st) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--st) 30%, transparent);
}
.result-icon.pending { --st: var(--primary); }
.result-icon.cancelled { --st: var(--text-muted); }
.result-icon.paid { --st: var(--warning); }
.result-icon.shipped { --st: #ff7f50; }
.result-icon.completed { --st: #2ed573; }

.order-confirm h1 { font-size: var(--text-2xl); font-weight: 800; color: var(--text-primary); margin: 0 0 24px; }
.order-confirm h1.pending { color: var(--primary); }
.order-confirm h1.cancelled { color: var(--text-muted); }
.order-confirm h1.completed { color: #2ed573; }

.info-card {
  border-radius: var(--radius-md); padding: 8px 20px; text-align: left; margin-bottom: 24px;
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.info-row {
  display: flex; justify-content: space-between; align-items: center; padding: 14px 0;
  font-size: 14px; color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
}
.info-row:last-child { border-bottom: none; }
.info-row span:first-child { color: var(--text-muted); }
.status-tag { color: var(--primary) !important; font-weight: 600; }
.price { color: var(--primary); font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }

.actions { display: flex; flex-direction: column; gap: 12px; }
.btn {
  width: 100%; padding: 14px; border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 600; cursor: pointer;
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out), background-color var(--dur-1) var(--ease-out), border-color var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out);
}
.btn--pay { background: var(--brand-gradient); color: #fff; box-shadow: var(--shadow-brand); }
.btn--pay:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(255, 71, 87, 0.32); }
.btn--cancel { background: var(--surface-2); color: var(--text-secondary); border: 1px solid var(--border); }
.btn--cancel:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-bg); }
.btn--orders { background: none; border: none; color: var(--text-secondary); text-decoration: underline; }
.btn--orders:hover { color: var(--primary); }

.loading { text-align: center; padding: 80px; color: var(--text-muted); }

@media (max-width: 768px) {
  .order-confirm { padding: 16px 12px; }
}
</style>
