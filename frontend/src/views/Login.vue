<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useForm } from '../composables/useForm'

// ============ Element Plus 表单 + v-focus 自定义指令 ============

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({ username: '', password: '' })

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

const { formRef, loading, handleSubmit } = useForm(async () => {
  await authStore.login(form.value)
  ElMessage.success('登录成功！')
  const redirect = route.query.redirect || '/'
  router.push(redirect)
})
</script>

<template>
  <div class="auth-page">
    <main class="auth-card glass glass--strong">
      <!-- 品牌标识 -->
      <header class="brand">
        <span class="brand__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </span>
        <span class="brand__name">电子微商城</span>
      </header>

      <div class="auth-head">
        <h1>欢迎登录</h1>
        <p class="subtitle">登录账户，开启你的数码生活</p>
      </div>

      <!-- Element Plus 表单组件 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
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
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  overflow-x: hidden;
  background:
    radial-gradient(72% 60% at 14% 8%, rgba(255, 122, 69, 0.1), transparent 60%),
    radial-gradient(60% 54% at 92% 18%, rgba(124, 77, 255, 0.1), transparent 60%),
    var(--bg-page);
  animation: fadeIn var(--dur-3) var(--ease-out);
}

/* 装饰性品牌光晕 */
.auth-page::before,
.auth-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  pointer-events: none;
  z-index: 0;
}
.auth-page::before {
  width: 420px;
  height: 420px;
  top: -140px;
  right: -110px;
  background: var(--brand-gradient-soft);
}
.auth-page::after {
  width: 360px;
  height: 360px;
  bottom: -140px;
  left: -120px;
  background: radial-gradient(circle, rgba(124, 77, 255, 0.12), transparent 70%);
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 40px 36px;
  border-radius: var(--radius-xl);
  text-align: center;
}

/* 品牌标识 */
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.brand__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-brand);
  color: #fff;
}
.brand__logo svg {
  width: 30px;
  height: 30px;
}
.brand__name {
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}

.auth-head {
  margin-bottom: 26px;
}
h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--text-primary);
}
.subtitle {
  margin: 8px 0 0;
  font-size: var(--text-md);
  color: var(--text-muted);
}

/* 表单标签 */
.auth-card :deep(.el-form-item__label) {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: var(--text-sm);
  padding-bottom: 6px;
  line-height: 1.4;
}
.auth-card :deep(.el-form-item) {
  margin-bottom: 18px;
}

/* 输入框磨砂底边 + 聚焦品牌描边（沿用 EP 自身背景，兼容明暗主题） */
.auth-card :deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
  box-shadow: 0 0 0 1px var(--border) inset;
  transition: box-shadow var(--dur-1) var(--ease-out);
}
.auth-card :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary) inset, 0 0 0 3px var(--primary-bg);
}

/* 提交按钮：品牌渐变签名 CTA */
.auth-card :deep(.el-button--danger) {
  background: var(--brand-gradient);
  border: none;
  box-shadow: var(--shadow-brand);
  font-weight: 600;
  transition: box-shadow var(--dur-1) var(--ease-out),
    transform var(--dur-1) var(--ease-out);
}
.auth-card :deep(.el-button--danger:focus),
.auth-card :deep(.el-button--danger:hover) {
  background: var(--brand-gradient);
  box-shadow: 0 10px 26px rgba(255, 71, 87, 0.32);
  transform: translateY(-1px);
}
.auth-card :deep(.el-button--danger:active) {
  transform: translateY(0);
}

.switch-link {
  margin-top: 22px;
  font-size: var(--text-md);
  color: var(--text-secondary);
}
.switch-link a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--dur-1) var(--ease-out);
}
.switch-link a:hover {
  color: var(--primary-hover);
}
.hint {
  margin-top: 14px;
  font-size: var(--text-xs);
  color: var(--text-placeholder);
}

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 22px;
    border-radius: var(--radius-lg);
  }
  h1 {
    font-size: var(--text-xl);
  }
  .brand__logo {
    width: 50px;
    height: 50px;
  }
  .brand__logo svg {
    width: 27px;
    height: 27px;
  }
}
</style>
