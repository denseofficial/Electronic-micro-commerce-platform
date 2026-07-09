import { Router } from 'express'
import { createOrder, getOrders, getOrderDetail, payOrder, cancelOrder, shipOrder, confirmReceive } from '../controllers/orderController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// 所有订单接口需要登录
router.use(authenticate)

// POST /api/orders — 创建订单
router.post('/', createOrder)

// GET /api/orders — 订单列表
router.get('/', getOrders)

// GET /api/orders/:id — 订单详情
router.get('/:id', getOrderDetail)

// POST /api/orders/:id/pay — 支付
router.post('/:id/pay', payOrder)

// POST /api/orders/:id/cancel — 取消
router.post('/:id/cancel', cancelOrder)

// POST /api/orders/:id/ship — 发货（演示）
router.post('/:id/ship', shipOrder)

// POST /api/orders/:id/receive — 确认收货
router.post('/:id/receive', confirmReceive)

export default router
