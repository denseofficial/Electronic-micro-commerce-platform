/**
 * 商品控制器
 * 复用前端 Mock 数据作为后端数据源
 */

import { products, categories } from '../../../frontend/src/mock/products.js'

/**
 * 获取商品列表（支持分类、搜索、排序、分页）
 */
export function getProducts(req, res) {
  const { categoryId, keyword, sort, page = 1, pageSize = 8 } = req.query

  let list = [...products]

  // 分类筛选
  if (categoryId) {
    list = list.filter((p) => p.categoryId === Number(categoryId))
  }

  // 关键词搜索
  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw),
    )
  }

  // 排序
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (sort === 'sales') list.sort((a, b) => b.sales - a.sales)
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)

  const total = list.length
  const start = (Number(page) - 1) * Number(pageSize)
  const items = list.slice(start, start + Number(pageSize))

  res.json({
    code: 200,
    data: {
      items,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  })
}

/**
 * 获取商品详情
 */
export function getProductDetail(req, res) {
  const product = products.find((p) => p.id === Number(req.params.id))
  if (!product) {
    return res.status(404).json({ code: 404, message: '商品不存在' })
  }
  res.json({ code: 200, data: product })
}

/**
 * 获取分类列表
 */
export function getCategories(_req, res) {
  res.json({ code: 200, data: categories })
}
