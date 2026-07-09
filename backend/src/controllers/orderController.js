import { collection } from '../database/index.js'

/**
 * 创建订单
 */
export function createOrder(req, res, next) {
  try {
    const { items, address, totalAmount } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ code: 400, message: '订单商品不能为空' })
    }
    if (!address) {
      return res.status(400).json({ code: 400, message: '收货地址不能为空' })
    }

    const orders = collection('orders')
    const order = {
      id: String(Date.now()),
      userId: req.user.id,
      status: 'pending',
      totalAmount,
      items,
      address,
      createTime: new Date().toISOString(),
      payTime: null,
      shipTime: null,
    }
    orders.insert(order)

    res.json({ code: 200, data: order, message: '订单创建成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取订单列表
 */
export function getOrders(req, res, next) {
  try {
    const { status } = req.query
    const orders = collection('orders')
    let list = orders.find({ userId: req.user.id })

    // 按时间倒序
    list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

    if (status) {
      list = list.filter((o) => o.status === status)
    }

    res.json({ code: 200, data: list })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取订单详情
 */
export function getOrderDetail(req, res, next) {
  try {
    const orders = collection('orders')
    const order = orders.findOne({ id: req.params.id })

    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }

    // 只能查看自己的订单
    if (order.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权查看该订单' })
    }

    res.json({ code: 200, data: order })
  } catch (err) {
    next(err)
  }
}

/**
 * 支付订单（模拟）
 */
export function payOrder(req, res, next) {
  try {
    const orders = collection('orders')
    const order = orders.findOne({ id: req.params.id })

    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }
    if (order.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权操作' })
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ code: 400, message: '订单状态不允许支付' })
    }

    orders.update({ id: req.params.id }, {
      status: 'paid',
      payTime: new Date().toISOString(),
    })

    const updated = orders.findOne({ id: req.params.id })
    res.json({ code: 200, data: updated, message: '支付成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 取消订单
 */
export function cancelOrder(req, res, next) {
  try {
    const orders = collection('orders')
    const order = orders.findOne({ id: req.params.id })

    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }
    if (order.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权操作' })
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ code: 400, message: '只能取消待付款订单' })
    }

    orders.update({ id: req.params.id }, { status: 'cancelled' })

    const updated = orders.findOne({ id: req.params.id })
    res.json({ code: 200, data: updated, message: '订单已取消' })
  } catch (err) {
    next(err)
  }
}
