import jwt from 'jsonwebtoken'
import config from '../config/index.js'

/**
 * JWT 认证中间件
 * 验证请求头中的 Bearer Token
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '请先登录' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded // { id, username }
    next()
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' })
  }
}

/**
 * 可选认证 — 不强制要求登录，但如果带了 token 就解析
 */
export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      req.user = jwt.verify(token, config.jwtSecret)
    } catch {
      // 忽略无效 token
    }
  }
  next()
}
