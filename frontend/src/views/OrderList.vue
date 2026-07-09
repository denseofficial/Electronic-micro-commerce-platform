<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders, cancelOrder } from '../api/orders'
import { formatPrice, formatDate, getOrderStatusText } from '../utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const orders = ref([])
const activeTab = ref('')

const tabs = [
  { key: '', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'paid', label: '待发货' },
  { key: 'shipped', label: '待收货' },
  { key: 'completed', label: '已完成' },
]

async function loadOrders() {
  const res = await getOrders({ status: activeTab.value || undefined })
  orders.value = res.data
}

onMounted(loadOrders)

function switchTab(tab) {
  activeTab.value = tab
  loadOrders()
}

function goDetail(id) {
  router.push({ name: 'OrderDetail', params: { id } })
}

async function handleCancel(order) {
  try {
    await ElMessageBox.confirm('确定取消该订单吗？', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '返回',
      type: 'warning',
    })
    const res = await cancelOrder(order.id)
    order.status = res.data.status
    ElMessage.success('订单已取消')
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('取消失败：' + (e.message || '未知错误'))
    }
  }
}

function goPay(order) {
  router.push({ name: 'OrderConfirm', params: { id: order.id } })
}
</script>

<template>
  <div class="orders-page">
    <h1 class="page-title">我的订单</h1>

    <!-- 状态 Tab -->
    <div class="tabs">
      <button
        v-for="tab in tabs" :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >{{ tab.label }}</button>
    </div>

    <!-- 订单列表 -->
    <div v-if="orders.length" class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <span>订单号：{{ order.id }}</span>
          <span class="status" :class="order.status">{{ getOrderStatusText(order.status) }}</span>
        </div>

        <div class="order-items">
          <div v-for="item in order.items" :key="item.productId" class="order-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <span>{{ formatPrice(item.price) }} × {{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <span class="time">{{ formatDate(order.createTime) }}</span>
          <span class="total">合计：<strong>{{ formatPrice(order.totalAmount) }}</strong></span>
          <div class="order-actions">
            <button v-if="order.status === 'pending'" class="btn btn--pay" @click="goPay(order)">去付款</button>
            <button v-if="order.status === 'pending'" class="btn btn--cancel" @click="handleCancel(order)">取消</button>
            <button class="btn btn--detail" @click="goDetail(order.id)">查看详情</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty">暂无订单</div>
  </div>
</template>

<style scoped>
.orders-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-title { font-size: 24px; font-weight: 700; color: #333; margin: 0 0 20px; }

.tabs {
  display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;
}
.tabs button {
  padding: 8px 18px; border: 1px solid #e0e0e0; border-radius: 20px;
  background: #fff; font-size: 13px; color: #666; cursor: pointer; transition: all 0.2s;
}
.tabs button.active { background: #ff4757; color: #fff; border-color: #ff4757; }

.order-card {
  background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px;
}
.order-header {
  display: flex; justify-content: space-between; font-size: 14px;
  padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; margin-bottom: 12px;
}
.status { font-weight: 600; }
.status.pending { color: #ff4757; }
.status.paid { color: #ff6348; }
.status.shipped { color: #3742fa; }
.status.completed { color: #2ed573; }
.status.cancelled { color: #999; }

.order-item { display: flex; gap: 12px; padding: 8px 0; }
.order-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
.item-info h4 { font-size: 14px; color: #333; margin: 0 0 4px; }
.item-info span { font-size: 12px; color: #999; }

.order-footer {
  display: flex; align-items: center; flex-wrap: wrap; gap: 12px;
  padding-top: 12px; border-top: 1px solid #f0f0f0; margin-top: 12px;
  font-size: 13px; color: #666;
}
.time { color: #999; }
.total { flex: 1; text-align: right; }
.total strong { font-size: 16px; color: #ff4757; }

.order-actions { display: flex; gap: 8px; }
.btn {
  padding: 6px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; border: 1px solid #e0e0e0;
  background: #fff; color: #666; transition: all 0.2s;
}
.btn--pay { background: #ff4757; color: #fff; border-color: #ff4757; }
.btn--cancel { }
.btn--detail { }

.empty { text-align: center; padding: 80px; color: #999; }
</style>
