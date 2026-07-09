import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { collection } from '../database/index.js'

/**
 * 用户注册
 */
export function register(req, res, next) {
  try {
    const { username, password, nickname } = req.body

    if (!username || !password || !nickname) {
      return res.status(400).json({ code: 400, message: '请填写所有必填字段' })
    }
    if (password.length < 6) {
      return res.status(400).json({ code: 400, message: '密码长度至少6位' })
    }

    const users = collection('users')
    if (users.findOne({ username })) {
      return res.status(400).json({ code: 400, message: '用户名已被注册' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = {
      id: Date.now(),
      username,
      password: hashedPassword,
      nickname,
      avatar: '',
      mobile: '',
      email: '',
      role: 'user',
      addresses: [],
    }
    users.insert(newUser)

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    )

    const { password: _, ...userInfo } = newUser
    res.json({
      code: 200,
      data: { token, user: userInfo },
      message: '注册成功',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 用户登录
 */
export function login(req, res, next) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '请输入用户名和密码' })
    }

    const users = collection('users')
    const user = users.findOne({ username })
    if (!user) {
      return res.status(400).json({ code: 400, message: '用户名或密码错误' })
    }

    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) {
      return res.status(400).json({ code: 400, message: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    )

    const { password: _, ...userInfo } = user
    res.json({
      code: 200,
      data: { token, user: userInfo },
      message: '登录成功',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 获取当前用户信息
 */
export function getUserInfo(req, res, next) {
  try {
    const users = collection('users')
    const user = users.findOne({ id: req.user.id })
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' })
    }
    const { password: _, ...userInfo } = user
    res.json({ code: 200, data: userInfo })
  } catch (err) {
    next(err)
  }
}
