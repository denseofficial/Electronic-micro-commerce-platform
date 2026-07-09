import { collection } from '../database/index.js'

/**
 * 重新计算某商品的评分聚合（平均星 + 评价数），并回写到商品目录。
 * 保证商品卡片/详情页展示的 rating 与 reviews 始终与评价表一致。
 */
function recomputeProductRating(productId) {
  const list = collection('reviews').find({ productId })
  const total = list.length
  const average = total
    ? Math.round((list.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
    : 0
  collection('products').update({ id: productId }, { rating: average, reviews: total })
  return { average, total }
}

/**
 * 校验用户是否已购买该商品（已付款/已发货/已完成订单中包含此商品）。
 * 评价仅向真实购买者开放，避免刷评。
 */
function hasPurchased(userId, productId) {
  return collection('orders')
    .find({ userId })
    .some(
      (o) =>
        ['paid', 'shipped', 'completed'].includes(o.status) &&
        o.items?.some((i) => i.productId === productId),
    )
}

/**
 * 获取商品评价列表（公开）
 * 返回 { items, average, total }
 */
export function getReviews(req, res, next) {
  try {
    const productId = Number(req.params.productId)
    const list = collection('reviews')
      .find({ productId })
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

    const total = list.length
    const average = total
      ? Math.round((list.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
      : 0

    res.json({ code: 200, data: { items: list, average, total } })
  } catch (err) {
    next(err)
  }
}

/**
 * 发表评价（需登录 + 已购买 + 未重复评价）
 */
export function createReview(req, res, next) {
  try {
    const productId = Number(req.params.productId)
    const product = collection('products').findOne({ id: productId })
    if (!product) {
      return res.status(404).json({ code: 404, message: '商品不存在' })
    }

    const rating = Number(req.body.rating)
    const content = String(req.body.content || '').trim()
    if (![1, 2, 3, 4, 5].includes(rating)) {
      return res.status(400).json({ code: 400, message: '请选择 1-5 星评分' })
    }
    if (content.length < 1 || content.length > 500) {
      return res.status(400).json({ code: 400, message: '评价内容需在 1-500 字之间' })
    }

    if (!hasPurchased(req.user.id, productId)) {
      return res.status(403).json({ code: 403, message: '购买后才能评价该商品' })
    }

    const reviews = collection('reviews')
    if (reviews.findOne({ productId, userId: req.user.id })) {
      return res.status(409).json({ code: 409, message: '您已评价过该商品' })
    }

    const user = collection('users').findOne({ id: req.user.id })
    const nickname = user?.nickname || req.user.username

    const review = {
      id: String(Date.now()),
      productId,
      userId: req.user.id,
      nickname,
      rating,
      content,
      images: [],
      createTime: new Date().toISOString(),
    }
    reviews.insert(review)

    const { average, total } = recomputeProductRating(productId)
    res.json({ code: 200, data: { review, average, total }, message: '评价成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 删除评价（仅本人）
 */
export function deleteReview(req, res, next) {
  try {
    const reviews = collection('reviews')
    const review = reviews.findOne({ id: req.params.id })
    if (!review) {
      return res.status(404).json({ code: 404, message: '评价不存在' })
    }
    if (review.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '只能删除自己的评价' })
    }

    reviews.remove({ id: req.params.id })
    const { average, total } = recomputeProductRating(review.productId)
    res.json({ code: 200, data: { average, total }, message: '已删除' })
  } catch (err) {
    next(err)
  }
}
