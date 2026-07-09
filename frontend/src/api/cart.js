/**
 * 购物车 API（当前以 localStorage 为主，后端就绪后切换）
 */

const CART_KEY = 'ec_mall_cart'

function getLocalCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

function saveLocalCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

/**
 * 获取购物车列表
 */
export function getCart() {
  return Promise.resolve({ code: 200, data: getLocalCart() })
}

/**
 * 添加商品到购物车
 */
export function addToCart({ product, quantity = 1, specs = '' }) {
  const cart = getLocalCart()
  const idx = cart.findIndex((item) => item.productId === product.id && item.specs === specs)
  if (idx > -1) {
    cart[idx].quantity += quantity
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      specs,
      stock: product.stock,
      checked: true,
    })
  }
  saveLocalCart(cart)
  return Promise.resolve({ code: 200, data: cart, message: '已加入购物车' })
}

/**
 * 更新购物车商品数量
 */
export function updateCartItem(productId, quantity) {
  const cart = getLocalCart()
  const item = cart.find((i) => i.productId === productId)
  if (item) {
    item.quantity = Math.max(1, Math.min(quantity, item.stock || 999))
  }
  saveLocalCart(cart)
  return Promise.resolve({ code: 200, data: cart })
}

/**
 * 删除购物车商品
 */
export function removeFromCart(productId) {
  const cart = getLocalCart().filter((i) => i.productId !== productId)
  saveLocalCart(cart)
  return Promise.resolve({ code: 200, data: cart })
}

/**
 * 切换商品选中状态
 */
export function toggleCartChecked(productId) {
  const cart = getLocalCart()
  const item = cart.find((i) => i.productId === productId)
  if (item) item.checked = !item.checked
  saveLocalCart(cart)
  return Promise.resolve({ code: 200, data: cart })
}

/**
 * 全选/取消全选
 */
export function toggleAllChecked(checked) {
  const cart = getLocalCart()
  cart.forEach((i) => (i.checked = checked))
  saveLocalCart(cart)
  return Promise.resolve({ code: 200, data: cart })
}

/**
 * 清空购物车（已选中的）
 */
export function clearCheckedCart() {
  const cart = getLocalCart().filter((i) => !i.checked)
  saveLocalCart(cart)
  return Promise.resolve({ code: 200, data: cart })
}
