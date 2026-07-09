import { collection } from '../database/index.js'

/**
 * 创建订单
 * 服务端对每一条目做：商品存在性校验、价格核对、库存校验，
 * 并依据商品目录重新计算总价、原子扣减库存，杜绝改价与超卖。
 */
export function createOrder(req, res, next) {
  try {
    const { items, address } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ code: 400, message: '订单商品不能为空' })
    }
    if (!address) {
      return res.status(400).json({ code: 400, message: '收货地址不能为空' })
    }

    const productsColl = collection('products')
    const allProducts = productsColl.all()

    const verifiedItems = []
    let serverTotal = 0

    for (const it of items) {
      const product = allProducts.find((p) => p.id === Number(it.productId))
      if (!product) {
        return res.status(400).json({ code: 400, message: `商品不存在：${it.productId}` })
      }
      // 允许成交价：普通目录价，或限时秒杀价（仅当客户端声明 isFlash 且商品已配置 flashPrice）
      const isFlash = !!it.isFlash && typeof product.flashPrice === 'number'
      const allowedPrice = isFlash ? product.flashPrice : product.price
      // 价格核对：客户端传入价与允许成交价偏差超过 0.01 即视为异常（防改价下单）
      if (Math.abs(Number(it.price) - allowedPrice) > 0.01) {
        return res.status(400).json({ code: 400, message: `商品价格已变动，请刷新后重试：${product.name}` })
      }
      if (product.stock < Number(it.quantity)) {
        return res.status(400).json({ code: 400, message: `库存不足：${product.name}（剩余 ${product.stock}）` })
      }
      serverTotal += allowedPrice * Number(it.quantity)
      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: allowedPrice,
        quantity: Number(it.quantity),
        image: product.image,
        specs: it.specs || '',
        isFlash,
      })
    }

    // 原子扣减库存：一次性整体写回，避免逐条 update 造成的中间态竞态
    const updatedProducts = allProducts.map((p) => {
      const it = verifiedItems.find((v) => v.productId === p.id)
      return it ? { ...p, stock: p.stock - it.quantity } : p
    })
    productsColl.replaceAll(updatedProducts)

    const orders = collection('orders')
    const order = {
      id: String(Date.now()),
      userId: req.user.id,
      status: 'pending',
      totalAmount: serverTotal,
      items: verifiedItems,
      address,
      createTime: new Date().toISOString(),
      payTime: null,
      shipTime: null,
      receiveTime: null,
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

/**
 * 发货（演示）：已付款订单 → 待收货
 * 真实场景应由商家/管理员触发，此处为教学演示放开给登录用户。
 */
export function shipOrder(req, res, next) {
  try {
    const orders = collection('orders')
    const order = orders.findOne({ id: req.params.id })

    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }
    if (order.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权操作' })
    }
    if (order.status !== 'paid') {
      return res.status(400).json({ code: 400, message: '仅已付款订单可发货' })
    }

    orders.update({ id: req.params.id }, {
      status: 'shipped',
      shipTime: new Date().toISOString(),
    })

    const updated = orders.findOne({ id: req.params.id })
    res.json({ code: 200, data: updated, message: '已发货' })
  } catch (err) {
    next(err)
  }
}

/**
 * 确认收货：待收货订单 → 已完成
 */
export function confirmReceive(req, res, next) {
  try {
    const orders = collection('orders')
    const order = orders.findOne({ id: req.params.id })

    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' })
    }
    if (order.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权操作' })
    }
    if (order.status !== 'shipped') {
      return res.status(400).json({ code: 400, message: '仅已发货订单可确认收货' })
    }

    orders.update({ id: req.params.id }, {
      status: 'completed',
      receiveTime: new Date().toISOString(),
    })

    const updated = orders.findOne({ id: req.params.id })
    res.json({ code: 200, data: updated, message: '已确认收货' })
  } catch (err) {
    next(err)
  }
}
