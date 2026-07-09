<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders, cancelOrder, shipOrder, confirmReceive } from '../api/orders'
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

async function handleShip(order) {
  try {
    await shipOrder(order.id)
    order.status = 'shipped'
    order.shipTime = new Date().toISOString()
    ElMessage.success('已发货')
  } catch (e) {
    ElMessage.error('发货失败：' + (e.response?.data?.message || e.message || '未知错误'))
  }
}

async function handleReceive(order) {
  try {
    await confirmReceive(order.id)
    order.status = 'completed'
    order.receiveTime = new Date().toISOString()
    ElMessage.success('已确认收货')
  } catch (e) {
    ElMessage.error('操作失败：' + (e.response?.data?.message || e.message || '未知错误'))
  }
}
</script>

<template>
  <div class="orders-page">
    <div class="page-head">
      <div>
        <h1 class="page-title">我的订单</h1>
        <p class="page-sub">查看与管理你的全部交易</p>
      </div>
      <span class="page-count">{{ orders.length }} 笔</span>
    </div>

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
      <div v-for="order in orders" :key="order.id" class="order-card glass">
        <div class="order-header">
          <span class="order-no">
            <svg class="ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            订单号：{{ order.id }}
          </span>
          <span class="status" :class="order.status">
            <span class="status-dot"></span>
            {{ getOrderStatusText(order.status) }}
          </span>
        </div>

        <div class="order-items">
          <el-table :data="order.items" style="width: 100%">
            <el-table-column label="商品" min-width="220">
              <template #default="{ row }">
                <div class="cell-product">
                  <img :src="row.image" :alt="row.name" class="cell-img" />
                  <span class="cell-name">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="110" align="center">
              <template #default="{ row }">{{ formatPrice(row.price) }}</template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity" width="80" align="center" />
            <el-table-column label="小计" width="110" align="center">
              <template #default="{ row }">{{ formatPrice(row.price * row.quantity) }}</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="order-footer">
          <span class="time">
            <svg class="ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            {{ formatDate(order.createTime) }}
          </span>
          <span class="total">合计：<strong>{{ formatPrice(order.totalAmount) }}</strong></span>
          <div class="order-actions">
            <button v-if="order.status === 'pending'" class="btn btn--primary btn--pay" @click="goPay(order)">去付款</button>
            <button v-if="order.status === 'pending'" class="btn btn--ghost btn--cancel" @click="handleCancel(order)">取消</button>
            <button v-if="order.status === 'paid'" class="btn btn--ghost btn--ship" @click="handleShip(order)">发货（演示）</button>
            <button v-if="order.status === 'shipped'" class="btn btn--ghost btn--receive" @click="handleReceive(order)">确认收货</button>
            <button class="btn btn--ghost btn--detail" @click="goDetail(order.id)">查看详情</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty glass">
      <span class="empty__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
      </span>
      <p>暂无订单</p>
      <span class="empty__hint">下单后这里会显示你的订单</span>
    </div>
  </div>
</template>

<style scoped>
.orders-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 16px; margin-bottom: 20px;
}
.page-title { font-size: var(--text-2xl); font-weight: 800; color: var(--text-primary); margin: 0; }
.page-sub { font-size: var(--text-sm); color: var(--text-muted); margin: 4px 0 0; }
.page-count {
  flex-shrink: 0; font-size: var(--text-sm); font-weight: 600; color: var(--primary);
  background: var(--primary-bg); padding: 5px 14px; border-radius: var(--radius-xl);
}

.tabs {
  display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;
}
.tabs button {
  padding: 8px 18px; border: 1px solid var(--border); border-radius: var(--radius-xl);
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur));
  font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer;
  transition: all var(--dur-1) var(--ease-out);
}
.tabs button:hover { border-color: var(--primary-light); color: var(--primary); }
.tabs button.active {
  background: var(--brand-gradient); color: #fff; border-color: transparent;
  box-shadow: var(--shadow-brand);
}

.order-list { display: flex; flex-direction: column; gap: 16px; }
.order-card {
  border-radius: var(--radius-lg); padding: 18px 20px;
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out), border-color var(--dur-1) var(--ease-out);
}
.order-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border-color: var(--primary-light);
}

.order-header {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding-bottom: 12px; border-bottom: 1px solid var(--border-light); margin-bottom: 12px;
}
.order-no {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: var(--text-sm); color: var(--text-secondary);
}
.order-no .ico { color: var(--text-muted); }

.status {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: var(--radius-xl);
  font-size: var(--text-xs); font-weight: 700;
  background: color-mix(in srgb, currentColor 12%, transparent);
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.status.pending { color: var(--primary); }
.status.paid { color: var(--warning); }
.status.shipped { color: #ff7f50; }
.status.completed { color: #2ed573; }
.status.cancelled { color: var(--text-muted); }

.order-items { margin: 4px 0; }
.order-items :deep(.el-table),
.order-items :deep(.el-table__inner-wrapper),
.order-items :deep(.el-table__body-wrapper),
.order-items :deep(.el-table tr),
.order-items :deep(.el-table th.el-table__cell),
.order-items :deep(.el-table td.el-table__cell) {
  background: transparent;
}
.order-items :deep(.el-table th.el-table__cell) {
  color: var(--text-secondary); font-weight: 600;
}
.order-items :deep(.el-table td.el-table__cell),
.order-items :deep(.el-table th.el-table__cell) {
  border-bottom: 1px solid var(--border-light);
}
.order-items :deep(.el-table::before) { display: none; }
.cell-product { display: flex; align-items: center; gap: 10px; }
.cell-img { width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; box-shadow: var(--shadow-sm); }
.cell-name { font-size: 14px; color: var(--text-primary); }

.order-footer {
  display: flex; align-items: center; flex-wrap: wrap; gap: 12px;
  padding-top: 14px; border-top: 1px solid var(--border-light); margin-top: 12px;
  font-size: 13px; color: var(--text-secondary);
}
.time { display: inline-flex; align-items: center; gap: 5px; color: var(--text-muted); }
.time .ico { opacity: 0.7; }
.total { flex: 1; text-align: right; color: var(--text-secondary); }
.total strong { font-size: var(--text-lg); color: var(--primary); font-variant-numeric: tabular-nums; }

.order-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.empty {
  text-align: center; padding: 56px 20px; border-radius: var(--radius-lg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.empty__icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--primary-bg); color: var(--primary); margin-bottom: 14px;
}
.empty p { font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
.empty__hint { font-size: var(--text-sm); color: var(--text-muted); }

@media (max-width: 768px) {
  .order-footer { flex-direction: column; align-items: stretch; }
  .total { text-align: left; }
  .order-actions { width: 100%; }
}
</style>
