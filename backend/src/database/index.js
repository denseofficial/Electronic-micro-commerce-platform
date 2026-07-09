/**
 * 轻量级 JSON 文件数据库
 * 无需安装任何数据库引擎，数据持久化到 data/ 目录
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', '..', 'data')

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

/**
 * 读取集合（对应一张"表"）
 */
function readCollection(name) {
  const file = path.join(DATA_DIR, `${name}.json`)
  if (!fs.existsSync(file)) {
    return []
  }
  try {
    const raw = fs.readFileSync(file, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/**
 * 写入集合
 */
function writeCollection(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * 获取集合操作对象
 */
export function collection(name) {
  return {
    /** 查询所有（支持筛选） */
    find(filter = {}) {
      let rows = readCollection(name)
      const keys = Object.keys(filter)
      if (keys.length > 0) {
        rows = rows.filter((row) => keys.every((k) => row[k] === filter[k]))
      }
      return [...rows] // 返回副本
    },

    /** 查询单条 */
    findOne(filter) {
      const rows = readCollection(name)
      const keys = Object.keys(filter)
      return rows.find((row) => keys.every((k) => row[k] === filter[k])) || null
    },

    /** 插入一条 */
    insert(doc) {
      const rows = readCollection(name)
      rows.push(doc)
      writeCollection(name, rows)
      return doc
    },

    /** 更新 */
    update(filter, updates) {
      const rows = readCollection(name)
      const keys = Object.keys(filter)
      const updated = []
      for (const row of rows) {
        if (keys.every((k) => row[k] === filter[k])) {
          Object.assign(row, updates)
          updated.push(row)
        }
      }
      writeCollection(name, rows)
      return updated
    },

    /** 删除 */
    remove(filter) {
      const rows = readCollection(name)
      const keys = Object.keys(filter)
      const kept = rows.filter((row) => !keys.every((k) => row[k] === filter[k]))
      writeCollection(name, kept)
      return rows.length - kept.length
    },

    /** 数量 */
    count(filter = {}) {
      return this.find(filter).length
    },

    /** 获取所有 */
    all() {
      return readCollection(name)
    },
  }
}

/**
 * 初始化种子数据
 */
export function initSeedData() {
  const users = collection('users')
  if (users.count() === 0) {
    const bcryptjs = __require_bcrypt()
    users.insert({
      id: 1,
      username: 'admin',
      password: bcryptjs.hashSync('admin123', 10),
      nickname: '小明',
      avatar: '',
    "mobile": "13811111111",
    "email": "xiaoming111@qq.com",
    "role": "user",
    "addresses": [
      {
        "id": 1,
        "name": "张三",
        "mobile": "13811111111",
        "province": "广东省",
        "city": "深圳市",
        "district": "南山区",
        "detail": "科技园路1号创新大厦A座1001室",
        "isDefault": true
      },
      {
        "id": 2,
        "name": "张三",
        "mobile": "13911111111",
        "province": "广东省",
        "city": "广州市",
        "district": "五山区",
        "detail": "五山路483号天河软件园A座1001室",
        "isDefault": false
        },
      ],
    })

    // 订单种子数据
    const orders = collection('orders')
    orders.insert({
    "id": "1783496388986",
    "userId": 1,
    "status": "paid",
    "totalAmount": 89,
    "items": [
      {
        "productId": 8,
        "name": "《深入理解计算机系统》第3版",
        "price": 89,
        "quantity": 1,
        "image": "src/assets/images/CSBook.jpg"
      }
    ],
    "address": {
      "name": "张三",
      "mobile": "13811111111",
      "full": "广东省深圳市南山区科技园路1号创新大厦A座1001室"
    },
    "createTime": "2026-07-08T07:39:48.986Z",
    "payTime": "2026-07-08T07:46:11.520Z",
    "shipTime": null
    })

    console.log('[DB] 种子数据已初始化')
  }
}

// 辅助：在初始化种子数据时加载 bcrypt
import { createRequire } from 'node:module'
function __require_bcrypt() {
  const require = createRequire(import.meta.url)
  return require('bcryptjs')
}
