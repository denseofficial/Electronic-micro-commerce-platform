import axios from 'axios'
import { getToken, removeToken } from './token'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 — 携带 token
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器 — 统一错误处理
request.interceptors.response.use(
  (response) => {
    const { data } = response
    // 根据后端约定的结构处理
    if (data.code === 0 || data.code === 200) {
      return data
    }
    if (data.code === 401) {
      removeToken()
      window.location.href = '/#/login'
    }
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    console.error('网络错误:', error.message)
    return Promise.reject(error)
  },
)

export default request
