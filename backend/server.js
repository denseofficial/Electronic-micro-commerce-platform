import app from './src/app.js'
import config from './src/config/index.js'

app.listen(config.port, () => {
  console.log(`\n🚀 电子微商城后端服务已启动`)
  console.log(`📍 地址: http://localhost:${config.port}`)
  console.log(`🔑 测试账号: admin / admin123`)
  console.log(`📋 API 基础路径: /api\n`)
})
