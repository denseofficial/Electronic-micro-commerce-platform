<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useForm } from '../composables/useForm'

// ============ Element Plus 表单组件 ============

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ username: '', password: '', confirmPassword: '', nickname: '' })

// 自定义校验：确认密码
const validateConfirmPassword = (_rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error('两次密码输入不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3位', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const { formRef, loading, handleSubmit } = useForm(async () => {
  await authStore.register({
    username: form.value.username,
    password: form.value.password,
    nickname: form.value.nickname,
  })
  ElMessage.success('注册成功，欢迎加入！')
  router.push('/')
})
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>注册</h1>
      <p class="subtitle">加入电子微商城，享更多优惠</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="至少6位密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="danger" :loading="loading" native-type="submit" style="width: 100%">
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>

      <p class="switch-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex; justify-content: center; align-items: center;
  min-height: 80vh; padding: 20px;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.auth-card {
  width: 100%; max-width: 420px;
  background: #fff; border-radius: 16px; padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}
h1 { font-size: 28px; font-weight: 700; color: #333; margin: 0; text-align: center; }
.subtitle { text-align: center; color: #999; font-size: 14px; margin: 8px 0 24px; }
.switch-link { text-align: center; font-size: 14px; color: #999; margin-top: 20px; }
.switch-link a { color: #ff4757; text-decoration: none; font-weight: 500; }
</style>
