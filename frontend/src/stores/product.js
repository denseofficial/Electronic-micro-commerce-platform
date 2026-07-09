import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProducts, getProductDetail, getCategories } from '../api/products'

export const useProductStore = defineStore('product', () => {
  // ============ State ============
  const list = ref([])
  const total = ref(0)
  const currentProduct = ref(null)
  const categories = ref([])
  const loading = ref(false)

  // ============ Actions ============
  async function fetchProducts(params) {
    loading.value = true
    try {
      const res = await getProducts(params)
      // 后端返回 { code: 200, data: { items, total, ... } }
      // 响应拦截器返回整个 body，数据在 res.data 中
      list.value = res.data.items
      total.value = res.data.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchProductDetail(id) {
    loading.value = true
    try {
      const res = await getProductDetail(id)
      currentProduct.value = res.data
      return currentProduct.value
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    const res = await getCategories()
    categories.value = res.data
    return categories.value
  }

  return {
    list,
    total,
    currentProduct,
    categories,
    loading,
    fetchProducts,
    fetchProductDetail,
    fetchCategories,
  }
})
