<script setup>
import { ref, inject, reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { updateUserProfile } from '../../api/user'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
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
  } catch (e) {
    ElMessage.error('更新失败：' + (e.message || '未知错误'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="profile-panel">
    <div class="info-card">
      <div class="avatar">👤</div>
      <h3>{{ authStore.nickname }}</h3>
      <p>@{{ authStore.user?.username }}</p>
    </div>

    <!-- 查看模式 -->
    <div v-if="!editing" class="info-list">
      <div class="info-item">
        <span class="label">昵称</span>
        <span>{{ authStore.user?.nickname || '未设置' }}</span>
      </div>
      <div class="info-item">
        <span class="label">手机号码</span>
        <span>{{ authStore.user?.mobile || '未绑定' }}</span>
      </div>
      <div class="info-item">
        <span class="label">电子邮箱</span>
        <span>{{ authStore.user?.email || '未绑定' }}</span>
      </div>
      <div class="info-item">
        <span class="label">站点名称</span>
        <span>{{ siteConfig?.siteName }}</span>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="edit-form">
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

    <el-button v-if="!editing" type="primary" @click="startEdit">编辑资料</el-button>
  </div>
</template>

<style scoped>
.profile-panel {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-card {
  text-align: center; padding: 24px;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  border-radius: 12px; color: #fff; margin-bottom: 16px;
}
.avatar { font-size: 48px; }
h3 { margin: 8px 0 4px; color: #fff; }

.info-list {
  background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 16px;
}
.info-item {
  display: flex; justify-content: space-between; padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5; font-size: 14px;
}
.info-item:last-child { border-bottom: none; }
.label { color: #999; }

.edit-form {
  background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px;
}
.form-group { margin-bottom: 14px; }
.form-group label {
  display: block; font-size: 13px; color: #666; margin-bottom: 6px;
}
.form-actions { display: flex; gap: 10px; justify-content: flex-end; }
</style>
