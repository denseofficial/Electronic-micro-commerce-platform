import request from '../utils/request'

/**
 * 获取商品评价列表
 * GET /api/reviews/product/:productId
 */
export function getReviews(productId) {
  return request.get(`/reviews/product/${productId}`)
}

/**
 * 发表评价（需登录）
 * POST /api/reviews/product/:productId
 */
export function createReview(productId, { rating, content }) {
  return request.post(`/reviews/product/${productId}`, { rating, content })
}

/**
 * 删除评价（仅本人）
 * DELETE /api/reviews/:id
 */
export function deleteReview(id) {
  return request.delete(`/reviews/${id}`)
}
