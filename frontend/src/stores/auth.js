import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setToken, removeToken, getToken, setUser as saveUser, getUser } from '../utils/token'
import { login as loginApi, register as registerApi, getUserInfo } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  // ============ State ============
  const token = ref(getToken() || '')
  const user = ref(getUser() || null)

  // ============ Getters ============
  const isLoggedIn = computed(() => !!token.value)
  const nickname = computed(() => user.value?.nickname || '未登录')
  const avatar = computed(() => user.value?.avatar || '')

  // ============ Actions ============
  async function login(credentials) {
    const res = await loginApi(credentials)
    token.value = res.data.token
    user.value = res.data.user
    setToken(res.data.token)
    saveUser(res.data.user)
    return res
  }

  async function register(formData) {
    const res = await registerApi(formData)
    token.value = res.data.token
    user.value = res.data.user
    setToken(res.data.token)
    saveUser(res.data.user)
    return res
  }

  async function fetchUserInfo() {
    const res = await getUserInfo()
    user.value = res.data
    saveUser(res.data)
  }

  // 更新用户信息并同步到 localStorage
  function updateUser(data) {
    user.value = { ...user.value, ...data }
    saveUser(user.value)
  }

  function logout() {
    token.value = ''
    user.value = null
    removeToken()
  }

  return {
    token,
    user,
    isLoggedIn,
    nickname,
    avatar,
    login,
    register,
    fetchUserInfo,
    updateUser,
    logout,
  }
})
