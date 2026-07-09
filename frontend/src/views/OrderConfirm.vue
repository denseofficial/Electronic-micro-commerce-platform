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
      {{ order.status === 'pending' ? '⏳' : order.status === 'cancelled' ? '❌' : '✅' }}
    </div>
    <h1>
      {{ order.status === 'pending' ? '订单已提交，请尽快付款' :
         order.status === 'cancelled' ? '订单已取消' : '支付成功！' }}
    </h1>

    <div class="info-card">
      <div class="info-row"><span>订单编号</span><span>{{ order.id }}</span></div>
      <div class="info-row"><span>创建时间</span><span>{{ formatDate(order.createTime) }}</span></div>
      <div class="info-row"><span>订单状态</span><span class="status-tag">{{ getOrderStatusText(order.status) }}</span></div>
      <div class="info-row"><span>应付金额</span><span class="price">{{ formatPrice(order.totalAmount) }}</span></div>
    </div>

    <div class="actions">
      <button v-if="order.status === 'pending'" class="btn btn--pay" @click="goPay">
        立即支付 {{ formatPrice(order.totalAmount) }}
      </button>
      <button v-if="order.status === 'pending'" class="btn btn--cancel" @click="handleCancel">
        取消订单
      </button>
      <button class="btn btn--orders" @click="router.push({ name: 'OrderList' })">
        查看订单列表
      </button>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<style scoped>
.order-confirm { text-align: center; animation: fadeIn 0.4s ease; max-width: 500px; margin: 0 auto; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.result-icon { font-size: 64px; margin: 20px 0; }
h1 { font-size: var(--text-xl); color: var(--text-primary); margin: 0 0 24px; }

.info-card {
  background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 24px;
}
.info-row {
  display: flex; justify-content: space-between; padding: 8px 0;
  font-size: 14px; color: var(--text-secondary);
}
.info-row span:first-child { color: var(--text-muted); }
.status-tag { color: var(--primary) !important; font-weight: 600; }
.price { color: var(--primary); font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }

.actions { display: flex; flex-direction: column; gap: 12px; }
.btn {
  padding: 14px; border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 600; cursor: pointer;
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out);
}
.btn--pay { background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: #fff; }
.btn--pay:hover { transform: translateY(-1px); box-shadow: var(--shadow-brand); }
.btn--cancel { background: var(--surface-2); color: var(--text-secondary); }
.btn--orders { background: none; color: var(--text-secondary); text-decoration: underline; }

.loading { text-align: center; padding: 80px; color: var(--text-muted); }
</style>
