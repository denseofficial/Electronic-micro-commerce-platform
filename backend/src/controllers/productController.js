import { collection } from '../database/index.js'

/**
 * 将商品展开为可检索的小写文本，并附带评分所需的原始字段。
 * 覆盖：名称、描述、规格值、分类名。
 */
function buildSearchIndex(product, categoryMap) {
  const nameLower = (product.name || '').toLowerCase()
  const descLower = (product.description || '').toLowerCase()
  const specsLower = Object.values(product.specs || {}).join(' ').toLowerCase()
  const catNameLower = (categoryMap[product.categoryId] || '').toLowerCase()
  return {
    nameLower,
    descLower,
    specsLower,
    catNameLower,
    haystack: [nameLower, descLower, specsLower, catNameLower].join(' '),
  }
}

/**
 * 单个商品对一组关键词的相关度评分（越高越相关）。
 * 命中名称权重最高，前缀命中额外加权；其次分类、描述、规格。
 */
function scoreProduct(index, tokens) {
  let score = 0
  for (const t of tokens) {
    if (index.nameLower.includes(t)) {
      score += 10
      if (index.nameLower.startsWith(t)) score += 5
    }
    if (index.catNameLower.includes(t)) score += 6
    if (index.descLower.includes(t)) score += 3
    if (index.specsLower.includes(t)) score += 2
  }
  return score
}

/**
 * 获取商品列表：支持分类筛选、关键词搜索（多字段/多关键词/相关度排序）、排序与分页。
 */
export function getProducts(req, res) {
  const { categoryId, keyword, sort, page = 1, pageSize = 8 } = req.query

  let list = [...collection('products').all()]

  // 分类筛选
  if (categoryId) {
    list = list.filter((p) => p.categoryId === Number(categoryId))
  }

  // 关键词搜索：多字段 + 多关键词（AND）+ 相关度排序
  const tokens = keyword
    ? keyword.trim().toLowerCase().split(/\s+/).filter(Boolean)
    : []
  if (tokens.length) {
    const categoryMap = Object.fromEntries(
      collection('categories').all().map((c) => [c.id, c.name]),
    )
    // 预计算检索索引（不可变，不修改原始商品）
    const indexed = list.map((p) => ({
      product: p,
      index: buildSearchIndex(p, categoryMap),
    }))
    // 入选条件：每个关键词都要命中（AND 语义，更精确）
    const matched = indexed.filter(({ index }) =>
      tokens.every((t) => index.haystack.includes(t)),
    )
    // 显式排序优先；否则按相关度降序（同分按销量降序）
    if (sort) {
      if (sort === 'price-asc') matched.sort((a, b) => a.product.price - b.product.price)
      if (sort === 'price-desc') matched.sort((a, b) => b.product.price - a.product.price)
      if (sort === 'sales') matched.sort((a, b) => b.product.sales - a.product.sales)
      if (sort === 'rating') matched.sort((a, b) => b.product.rating - a.product.rating)
      list = matched.map((m) => m.product)
    } else {
      list = matched
        .map((m) => ({ product: m.product, score: scoreProduct(m.index, tokens) }))
        .sort((a, b) => b.score - a.score || b.product.sales - a.product.sales)
        .map((m) => m.product)
    }
  } else if (sort) {
    // 无关键词但指定了排序：沿用原逻辑
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'sales') list.sort((a, b) => b.sales - a.sales)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  }

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
