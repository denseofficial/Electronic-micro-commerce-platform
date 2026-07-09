/**
 * 验证手机号
 */
export function isMobile(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 */
export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 验证密码（6-20位，包含字母和数字）
 */
export function isValidPassword(pwd) {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/.test(pwd)
}

/**
 * 验证非空
 */
export function isNotEmpty(val) {
  return val !== null && val !== undefined && String(val).trim() !== ''
}

/**
 * 表单校验规则集
 */
export const rules = {
  required: (msg = '此项为必填') => ({
    required: true,
    message: msg,
    trigger: 'blur',
  }),
  mobile: {
    validator: (_rule, value) => {
      if (!value || isMobile(value)) return Promise.resolve()
      return Promise.reject('请输入正确的手机号码')
    },
    trigger: 'blur',
  },
  email: {
    validator: (_rule, value) => {
      if (!value || isEmail(value)) return Promise.resolve()
      return Promise.reject('请输入正确的邮箱地址')
    },
    trigger: 'blur',
  },
  password: {
    validator: (_rule, value) => {
      if (!value || isValidPassword(value)) return Promise.resolve()
      return Promise.reject('密码需6-20位，且包含字母和数字')
    },
    trigger: 'blur',
  },
}
