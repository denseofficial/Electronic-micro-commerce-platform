import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem,
  removeFromCart as removeFromCartApi,
  toggleCartChecked,
  toggleAllChecked,
  clearCheckedCart,
} from '../api/cart'

export const useCartStore = defineStore('cart', () => {
  // ============ State ============
  const items = ref([])

  // ============ Getters ============
  const totalCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const checkedItems = computed(() => items.value.filter((i) => i.checked))
  const checkedCount = computed(() => checkedItems.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalPrice = computed(() => checkedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0))
  const isAllChecked = computed(() => items.value.length > 0 && items.value.every((i) => i.checked))

  // ============ Actions ============
  async function fetchCart() {
    const res = await getCart()
    items.value = res.data
  }

  async function addToCart(product, quantity = 1, specs = '') {
    const res = await addToCartApi({ product, quantity, specs })
    items.value = res.data
    return res
  }

  async function updateQuantity(productId, quantity) {
    const res = await updateCartItem(productId, quantity)
    items.value = res.data
  }

  async function removeItem(productId) {
    const res = await removeFromCartApi(productId)
    items.value = res.data
  }

  async function toggleCheck(productId) {
    const res = await toggleCartChecked(productId)
    items.value = res.data
  }

  async function toggleAll(checked) {
    const res = await toggleAllChecked(checked)
    items.value = res.data
  }

  async function clearChecked() {
    const res = await clearCheckedCart()
    items.value = res.data
  }

  return {
    items,
    totalCount,
    checkedItems,
    checkedCount,
    totalPrice,
    isAllChecked,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    toggleCheck,
    toggleAll,
    clearChecked,
  }
})
