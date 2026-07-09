import request from '../utils/request'

/**
 * 获取订单列表
 * GET /api/orders?status=xxx
 */
export function getOrders(params = {}) {
  return request.get('/orders', { params })
}

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
export function getOrderDetail(orderId) {
  return request.get(`/orders/${orderId}`)
}

/**
 * 创建订单
 * POST /api/orders
 */
export function createOrder(orderData) {
  return request.post('/orders', orderData)
}

/**
 * 支付订单（模拟）
 * POST /api/orders/:id/pay
 */
export function payOrder(orderId) {
  return request.post(`/orders/${orderId}/pay`)
}

/**
 * 取消订单
 * POST /api/orders/:id/cancel
 */
export function cancelOrder(orderId) {
  return request.post(`/orders/${orderId}/cancel`)
}

/**
 * 发货（演示）
 * POST /api/orders/:id/ship
 */
export function shipOrder(orderId) {
  return request.post(`/orders/${orderId}/ship`)
}

/**
 * 确认收货
 * POST /api/orders/:id/receive
 */
export function confirmReceive(orderId) {
  return request.post(`/orders/${orderId}/receive`)
}
