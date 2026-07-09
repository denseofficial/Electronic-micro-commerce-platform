import { Router } from 'express'
import { createOrder, getOrders, getOrderDetail, payOrder, cancelOrder } from '../controllers/orderController.js'
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

export default router
