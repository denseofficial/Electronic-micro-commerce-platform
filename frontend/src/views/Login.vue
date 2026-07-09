<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

// ============ Element Plus 表单 + v-focus 自定义指令 ============

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref(null)
const form = ref({ username: '', password: '' })
const loading = ref(false)

// Element Plus 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
}

async function handleLogin() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return // 校验未通过
  }

  loading.value = true
  try {
    await authStore.login(form.value)
    ElMessage.success('登录成功！')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>登录</h1>
      <p class="subtitle">欢迎回到电子微商城</p>

      <!-- Element Plus 表单组件 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <!-- v-focus 自定义指令：页面加载后自动聚焦 -->
          <el-input
            v-focus
            v-model="form.username"
            placeholder="请输入用户名"
            autocomplete="username"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            :loading="loading"
            native-type="submit"
            style="width: 100%"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <p class="switch-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
      <p class="hint">提示：测试账号 admin / admin123</p>
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
.hint { text-align: center; font-size: 12px; color: #bbb; margin-top: 12px; }
</style>
