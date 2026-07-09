import request from '../utils/request'

//          认证 API（真实后端）

/**
 * 登录
 * POST /api/auth/login
 */
export function login(data) {
  return request.post('/auth/login', data)
}

/**
 * 注册
 * POST /api/auth/register
 */
export function register(data) {
  return request.post('/auth/register', data)
}

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
export function getUserInfo() {
  return request.get('/auth/me')
}
