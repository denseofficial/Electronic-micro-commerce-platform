import { collection } from '../database/index.js'

/**
 * 获取地址列表
 */
export function getAddresses(req, res, next) {
  try {
    const users = collection('users')
    const user = users.findOne({ id: req.user.id })
    res.json({ code: 200, data: user?.addresses || [] })
  } catch (err) {
    next(err)
  }
}

/**
 * 添加地址
 */
export function addAddress(req, res, next) {
  try {
    const { name, mobile, province, city, district, detail, isDefault } = req.body

    if (!name || !mobile || !province || !city || !district || !detail) {
      return res.status(400).json({ code: 400, message: '请填写完整的地址信息' })
    }

    const users = collection('users')
    const user = users.findOne({ id: req.user.id })
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' })
    }

    const newAddr = {
      id: Date.now(),
      name,
      mobile,
      province,
      city,
      district,
      detail,
      isDefault: isDefault || false,
    }

    // 如果设为默认，取消其他默认
    if (newAddr.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false))
    }
    // 如果是第一个地址，自动设为默认
    if (user.addresses.length === 0) {
      newAddr.isDefault = true
    }

    user.addresses.push(newAddr)
    users.update({ id: req.user.id }, { addresses: user.addresses })

    res.json({ code: 200, data: newAddr, message: '地址添加成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 更新地址
 */
export function updateAddress(req, res, next) {
  try {
    const users = collection('users')
    const user = users.findOne({ id: req.user.id })
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' })
    }

    const addr = user.addresses.find((a) => a.id === Number(req.params.id))
    if (!addr) {
      return res.status(404).json({ code: 404, message: '地址不存在' })
    }

    const updates = req.body
    if (updates.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false))
    }
    Object.assign(addr, updates)
    users.update({ id: req.user.id }, { addresses: user.addresses })

    res.json({ code: 200, data: addr, message: '地址更新成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 删除地址
 */
export function deleteAddress(req, res, next) {
  try {
    const users = collection('users')
    const user = users.findOne({ id: req.user.id })
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' })
    }

    const filtered = user.addresses.filter((a) => a.id !== Number(req.params.id))
    if (filtered.length === user.addresses.length) {
      return res.status(404).json({ code: 404, message: '地址不存在' })
    }

    users.update({ id: req.user.id }, { addresses: filtered })
    res.json({ code: 200, message: '地址删除成功' })
  } catch (err) {
    next(err)
  }
}

/**
 * 更新用户信息
 */
export function updateProfile(req, res, next) {
  try {
    const { nickname, avatar, mobile, email } = req.body
    const users = collection('users')
    const updates = {}
    if (nickname !== undefined) updates.nickname = nickname
    if (avatar !== undefined) updates.avatar = avatar
    if (mobile !== undefined) updates.mobile = mobile
    if (email !== undefined) updates.email = email

    users.update({ id: req.user.id }, updates)
    const user = users.findOne({ id: req.user.id })
    const { password: _, ...userInfo } = user

    res.json({ code: 200, data: userInfo, message: '更新成功' })
  } catch (err) {
    next(err)
  }
}
