import { ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 表单通用逻辑 composable
 * 封装 Element Plus 表单的「校验 → 提交 → loading → 错误提示」标准流程，
 * 供 Login / Register / ProfilePanel 等所有表单页面复用。
 *
 * @param {() => Promise<void>} submitFn 校验通过后的提交逻辑
 * @returns { formRef, loading, handleSubmit }
 */
export function useForm(submitFn) {
  const formRef = ref(null)
  const loading = ref(false)

  async function handleSubmit() {
    if (!formRef.value) return
    try {
      await formRef.value.validate()
    } catch {
      return // 校验未通过，拦截提交
    }

    loading.value = true
    try {
      await submitFn()
    } catch (e) {
      ElMessage.error(e.message || '操作失败')
    } finally {
      loading.value = false
    }
  }

  return { formRef, loading, handleSubmit }
}
