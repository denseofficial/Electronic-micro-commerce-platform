import { collection } from '../database/index.js'

/**
 * 获取商品列表（支持分类、搜索、排序、分页）
 * 数据源为后端 products 集合，不再依赖前端 mock。
 */
export function getProducts(req, res) {
  const { categoryId, keyword, sort, page = 1, pageSize = 8 } = req.query

  let list = [...collection('products').all()]

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
  const product = collection('products').findOne({ id: Number(req.params.id) })
  if (!product) {
    return res.status(404).json({ code: 404, message: '商品不存在' })
  }
  res.json({ code: 200, data: product })
}

/**
 * 获取分类列表
 */
export function getCategories(_req, res) {
  res.json({ code: 200, data: collection('categories').all() })
}
