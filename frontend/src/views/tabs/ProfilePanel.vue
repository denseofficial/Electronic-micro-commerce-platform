<script setup>
import { ref, inject, reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useMembershipStore } from '../../stores/membership'
import { updateUserProfile } from '../../api/user'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const membership = useMembershipStore()
const siteConfig = inject('siteConfig')

// ============ 编辑模式 ============
const editing = ref(false)
const saving = ref(false)
const form = reactive({
  nickname: '',
  mobile: '',
  email: '',
})

// 进入编辑：用当前用户数据填充表单
function startEdit() {
  form.nickname = authStore.user?.nickname || ''
  form.mobile = authStore.user?.mobile || ''
  form.email = authStore.user?.email || ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

// 保存到后端
async function handleSave() {
  if (!form.nickname.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }
  saving.value = true
  try {
    const res = await updateUserProfile({
      nickname: form.nickname,
      mobile: form.mobile,
      email: form.email,
    })
    // 同步更新 authStore 并持久化到 localStorage
    authStore.updateUser(res.data)
    editing.value = false
    ElMessage.success('个人信息更新成功！')
    // 完善资料任务完成：发放积分（仅一次）
    membership.award('profile', '完善个人资料')
  } catch (e) {
    ElMessage.error('更新失败：' + (e.message || '未知错误'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="profile-panel">
    <section class="info-card glass">
      <div class="avatar">
        <svg
          class="avatar__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h3 class="info-card__name">{{ authStore.nickname }}</h3>
      <p class="info-card__username">@{{ authStore.user?.username }}</p>
    </section>

    <!-- 查看模式 -->
    <div v-if="!editing" class="info-list glass">
      <div class="info-item">
        <span class="label">昵称</span>
        <span class="value">{{ authStore.user?.nickname || '未设置' }}</span>
      </div>
      <div class="info-item">
        <span class="label">手机号码</span>
        <span class="value">{{ authStore.user?.mobile || '未绑定' }}</span>
      </div>
      <div class="info-item">
        <span class="label">电子邮箱</span>
        <span class="value">{{ authStore.user?.email || '未绑定' }}</span>
      </div>
      <div class="info-item">
        <span class="label">站点名称</span>
        <span class="value">{{ siteConfig?.siteName }}</span>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="edit-form glass">
      <div class="form-group">
        <label>昵称</label>
        <el-input v-model="form.nickname" placeholder="请输入昵称" maxlength="20" />
      </div>
      <div class="form-group">
        <label>手机号码</label>
        <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11" />
      </div>
      <div class="form-group">
        <label>电子邮箱</label>
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </div>
      <div class="form-actions">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="danger" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </div>

    <el-button v-if="!editing" type="primary" class="edit-trigger" @click="startEdit">编辑资料</el-button>
  </div>
</template>

<style scoped>
.profile-panel {
  animation: fadeIn 0.3s var(--ease-out);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- 资料卡 ---------- */
.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 26px 24px;
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
}
.info-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-gradient);
  color: #fff;
  box-shadow: var(--shadow-brand);
  margin-bottom: 6px;
}
.avatar__icon { width: 34px; height: 34px; }
.info-card__name {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
}
.info-card__username {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ---------- 信息列表 ---------- */
.info-list {
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 16px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-light);
  font-size: var(--text-md);
  transition: background var(--dur-1) var(--ease-out);
}
.info-item:last-child { border-bottom: none; }
.info-item:hover { background: var(--surface-2); }
.label { color: var(--text-muted); flex: 0 0 auto; }
.value {
  color: var(--text-primary);
  font-weight: 500;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 编辑表单 ---------- */
.edit-form {
  border-radius: var(--radius-lg);
  padding: 18px;
  margin-bottom: 16px;
}
.form-group { margin-bottom: 14px; }
.form-group label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
}

/* ---------- 主操作按钮（品牌渐变 CTA） ---------- */
.profile-panel :deep(.el-button--primary) {
  background: var(--brand-gradient);
  border: none;
  box-shadow: var(--shadow-brand);
}
.profile-panel :deep(.el-button--primary:hover) {
  background: var(--brand-gradient);
  filter: brightness(1.04);
  box-shadow: 0 10px 26px rgba(255, 71, 87, 0.32);
}

.edit-trigger {
  width: 100%;
}

/* ---------- 响应式 ---------- */
@media (max-width: 480px) {
  .avatar { width: 56px; height: 56px; }
  .avatar__icon { width: 30px; height: 30px; }
}
</style>
