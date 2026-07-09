import request from '../utils/request'

// ============ 用户 API（真实后端） ============

/**
 * 更新个人信息
 * PUT /api/users/profile
 */
export function updateUserProfile(data) {
  return request.put('/users/profile', data)
}

/**
 * 获取地址列表
 * GET /api/users/addresses
 */
export function getAddresses() {
  return request.get('/users/addresses')
}

/**
 * 添加地址
 * POST /api/users/addresses
 */
export function addAddress(address) {
  return request.post('/users/addresses', address)
}

/**
 * 更新地址
 * PUT /api/users/addresses/:id
 */
export function updateAddress(id, data) {
  return request.put(`/users/addresses/${id}`, data)
}

/**
 * 删除地址
 * DELETE /api/users/addresses/:id
 */
export function deleteAddress(id) {
  return request.delete(`/users/addresses/${id}`)
}
