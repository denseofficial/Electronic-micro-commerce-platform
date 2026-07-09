import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from './config/index.js'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { initSeedData } from './database/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// ---------- 全局中间件 ----------
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件（上传的图片等）
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ---------- API 路由 ----------
app.use('/api', routes)

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ---------- 错误处理 ----------
app.use(notFound)
app.use(errorHandler)

// ---------- 初始化种子数据 ----------
initSeedData()

export default app
