/**
 * 全局错误处理中间件
 */
export function errorHandler(err, _req, res, _next) {
  console.error('[Error]', err.message || err)

  const status = err.status || 500
  const message = err.message || '服务器内部错误'

  res.status(status).json({
    code: status,
    message,
  })
}

/**
 * 404 中间件
 */
export function notFound(_req, res) {
  res.status(404).json({ code: 404, message: '接口不存在' })
}
