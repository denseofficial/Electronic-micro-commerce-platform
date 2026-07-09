/**
 * 格式化价格为 ¥xx.xx
 */
export function formatPrice(price) {
  return `¥${Number(price).toFixed(2)}`
}

/**
 * 格式化日期为 YYYY-MM-DD HH:mm
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * 订单状态映射
 */
export const orderStatusMap = {
  pending: '待付款',
  paid: '待发货',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消',
}

/**
 * 获取订单状态文字
 */
export function getOrderStatusText(status) {
  return orderStatusMap[status] || '未知'
}
