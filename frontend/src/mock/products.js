/**
 * 商品 Mock 数据
 * 用于后端 API 就绪前的前端开发和演示
 */

export const categories = [
  { id: 1, name: '手机数码', icon: '📱' },
  { id: 2, name: '电脑办公', icon: '💻' },
  { id: 3, name: '家用电器', icon: '🏠' },
  { id: 4, name: '服饰鞋包', icon: '👗' },
  { id: 5, name: '食品生鲜', icon: '🍎' },
  { id: 6, name: '图书文娱', icon: '📚' },
]

export const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    categoryId: 1,
    price: 9988.00,
    originalPrice: 10999.00,
    image: 'src/assets/images/iPhone15.jpg',
    images: [
      'src/assets/images/iPhone15a.jpg',
      'src/assets/images/iPhone15b.jpg',
    ],
    sales: 12580,
    rating: 4.8,
    reviews: 3268,
    stock: 99,
    description: 'A17 Pro 芯片 | 钛金属设计 | 4800 万像素主摄 | USB-C 接口',
    specs: { 颜色: '原色钛金属', 存储: '256GB', 屏幕: '6.7英寸' },
    isNew: true,
    isHot: true,
  },
  {
    id: 2,
    name: '华为 Mate 60 Pro',
    categoryId: 1,
    price: 6999.00,
    originalPrice: 6999.00,
    image: 'src/assets/images/Mate60.jpg',
    images: [
      'src/assets/images/Mate60a.jpg',
      'src/assets/images/Mate60b.jpg',
    ],
    sales: 23100,
    rating: 4.9,
    reviews: 5621,
    stock: 56,
    description: '麒麟 9000S | 卫星通话 | 超可靠玄武架构 | 鸿蒙 OS',
    specs: { 颜色: '雅丹黑', 存储: '512GB', 屏幕: '6.82英寸' },
    isNew: false,
    isHot: true,
  },
  {
    id: 3,
    name: 'MacBook Pro 14英寸 M3 Pro',
    categoryId: 2,
    price: 14999.00,
    originalPrice: 16999.00,
    image: 'src/assets/images/MacBook.jpg',
    images: [
      'src/assets/images/MacBooka.jpg',
      'src/assets/images/MacBookb.jpg',
    ],
    sales: 4320,
    rating: 4.7,
    reviews: 1890,
    stock: 35,
    description: 'Apple M3 Pro 芯片 | 18GB 统一内存 | Liquid Retina XDR 显示屏',
    specs: { 颜色: '深空黑', 内存: '18GB', 存储: '512GB SSD' },
    isNew: true,
    isHot: false,
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5 头戴式降噪耳机',
    categoryId: 1,
    price: 2499.00,
    originalPrice: 2999.00,
    image: 'src/assets/images/SonyXM5.jpg',
    images: [
      'src/assets/images/SonyXM5a.jpg',
      'src/assets/images/SonyXM5b.jpg',
    ],
    sales: 8900,
    rating: 4.6,
    reviews: 4521,
    stock: 200,
    description: '行业领先降噪 | 30小时续航 | 快充3分钟播放3小时',
    specs: { 颜色: '铂金银', 类型: '无线头戴式', 续航: '30小时' },
    isNew: false,
    isHot: true,
  },
  {
    id: 5,
    name: '戴森 V15 Detect 无绳吸尘器',
    categoryId: 3,
    price: 4990.00,
    originalPrice: 5690.00,
    image: 'src/assets/images/Dyson.jpg',
    images: [
      'src/assets/images/Dysona.jpg',
      'src/assets/images/Dysonb.jpg',
    ],
    sales: 6540,
    rating: 4.8,
    reviews: 2340,
    stock: 78,
    description: '激光探测微尘 | LCD 屏实时显示 | 整机过滤 99.99% 微尘',
    specs: { 型号: 'V15 Detect', 功率: '240AW', 续航: '60分钟' },
    isNew: false,
    isHot: false,
  },
  {
    id: 6,
    name: 'Nike Air Jordan 1 Retro High OG',
    categoryId: 4,
    price: 1299.00,
    originalPrice: 1499.00,
    image: 'src/assets/images/aj1.jpg',
    images: [
      'src/assets/images/aj1a.jpg',
      'src/assets/images/aj1b.jpg',
    ],
    sales: 32000,
    rating: 4.9,
    reviews: 8930,
    stock: 15,
    description: '经典复刻 | 优质皮革鞋面 | Air-Sole 缓震',
    specs: { 颜色: '黑红脚趾', 尺码: '36-46', 材质: '头层牛皮' },
    isNew: false,
    isHot: true,
  },
  {
    id: 7,
    name: '良品铺子 坚果大礼包 1888g',
    categoryId: 5,
    price: 128.00,
    originalPrice: 198.00,
    image: 'src/assets/images/Nuts.jpg',
    images: [
      'src/assets/images/Nuts.jpg',
    ],
    sales: 56000,
    rating: 4.5,
    reviews: 12340,
    stock: 500,
    description: '每日坚果 | 8种坚果组合 | 年货送礼佳品',
    specs: { 净含量: '1888g', 保质期: '240天', 包装: '礼盒装' },
    isNew: false,
    isHot: false,
  },
  {
    id: 8,
    name: '《深入理解计算机系统》第3版',
    categoryId: 6,
    price: 89.00,
    originalPrice: 139.00,
    image: 'src/assets/images/CSBook.jpg',
    images: [
      'src/assets/images/CSBook.jpg',
    ],
    sales: 18900,
    rating: 4.9,
    reviews: 4560,
    stock: 300,
    description: 'CMU 经典教材 | 程序员必读 | 从硬件到软件全栈理解',
    specs: { 作者: 'Randal E. Bryant', 出版社: '机械工业出版社', 页数: '737页' },
    isNew: false,
    isHot: false,
  },
  {
    id: 9,
    name: '小米电视 S Pro 75英寸 Mini LED',
    categoryId: 3,
    price: 5999.00,
    originalPrice: 6999.00,
    image: 'src/assets/images/MiTV.jpg',
    images: [
      'src/assets/images/MiTV.jpg',
    ],
    sales: 8900,
    rating: 4.6,
    reviews: 2780,
    stock: 42,
    description: 'Mini LED 背光 | 144Hz 高刷 | 3GB+32GB | 澎湃 OS',
    specs: { 尺寸: '75英寸', 分辨率: '4K', 刷新率: '144Hz' },
    isNew: true,
    isHot: false,
  },
  {
    id: 10,
    name: '优衣库 轻薄羽绒服',
    categoryId: 4,
    price: 399.00,
    originalPrice: 599.00,
    image: 'src/assets/images/Uniqlo.jpg',
    images: [
      'src/assets/images/Uniqlo.jpg',
    ],
    sales: 45000,
    rating: 4.4,
    reviews: 8970,
    stock: 180,
    description: '90%白鸭绒 | 轻薄保暖 | 防水防静电 | 可收纳',
    specs: { 颜色: '黑色/藏青/米白', 尺码: 'S-XXL', 填充: '90%白鸭绒' },
    isNew: false,
    isHot: false,
  },
  {
    id: 11,
    name: 'iPad Air M2 11英寸',
    categoryId: 2,
    price: 4799.00,
    originalPrice: 5499.00,
    image: 'src/assets/images/iPadAir.jpg',
    images: [
      'src/assets/images/iPadAir.jpg',
    ],
    sales: 12300,
    rating: 4.7,
    reviews: 3450,
    stock: 67,
    description: 'M2 芯片 | Liquid Retina 显示屏 | 支持 Apple Pencil Pro',
    specs: { 颜色: '星光色', 存储: '128GB', 屏幕: '11英寸' },
    isNew: true,
    isHot: true,
  },
  {
    id: 12,
    name: '三只松鼠 巨型零食大礼包 3kg',
    categoryId: 5,
    price: 168.00,
    originalPrice: 268.00,
    image: 'src/assets/images/Squirrel.jpg',
    images: [
      'src/assets/images/Squirrel.jpg',
    ],
    sales: 78000,
    rating: 4.3,
    reviews: 15670,
    stock: 320,
    description: '30袋装 | 膨化+坚果+果干混合 | 追剧必备',
    specs: { 净含量: '3kg', 袋数: '30袋', 保质期: '180天' },
    isNew: false,
    isHot: true,
  },
]

/**
 * 模拟延迟
 */
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 获取商品列表
 */
export async function getMockProducts({ categoryId, keyword, sort, page = 1, pageSize = 8 } = {}) {
  await delay()
  let list = [...products]

  if (categoryId) {
    list = list.filter((p) => p.categoryId === Number(categoryId))
  }
  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw))
  }

  // 排序
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (sort === 'sales') list.sort((a, b) => b.sales - a.sales)

  const total = list.length
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

/**
 * 获取单个商品详情
 */
export async function getMockProductDetail(id) {
  await delay()
  return products.find((p) => p.id === Number(id)) || null
}

/**
 * 获取分类列表
 */
export async function getMockCategories() {
  await delay(100)
  return categories
}
