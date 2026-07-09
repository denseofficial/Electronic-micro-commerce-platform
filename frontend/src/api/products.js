import request from '../utils/request'

// ============ 商品 API（真实后端） ============

/**
 * 获取商品列表（支持分类、搜索、排序、分页）
 * GET /api/products?categoryId=&keyword=&sort=&page=&pageSize=
 */
export function getProducts(params) {
  return request.get('/products', { params })
}

/**
 * 获取商品详情
 * GET /api/products/:id
 */
export function getProductDetail(id) {
  return request.get(`/products/${id}`)
}

/**
 * 获取分类列表
 * GET /api/categories
 */
export function getCategories() {
  return request.get('/categories')
}
