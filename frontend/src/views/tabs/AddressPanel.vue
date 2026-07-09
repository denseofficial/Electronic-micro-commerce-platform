<script setup>
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../api/user'

// ============ KeepAlive 生命周期 ============
onActivated(() => {
  console.log('[AddressPanel] 从缓存激活')
})
onDeactivated(() => {
  console.log('[AddressPanel] 被缓存')
})

// ============ 地址列表 ============
const addresses = ref([])
const loading = ref(false)

async function fetchAddresses() {
  loading.value = true
  try {
    const res = await getAddresses()
    addresses.value = res.data
  } catch (e) {
    ElMessage.error('获取地址失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

onMounted(fetchAddresses)

// ============ 对话框控制 ============
const dialogVisible = ref(false)
const dialogTitle = ref('新增地址')
const isEdit = ref(false)
const saving = ref(false)

// 表单数据
const form = reactive({
  id: null,
  name: '',
  mobile: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

// 重置表单
function resetForm() {
  form.id = null
  form.name = ''
  form.mobile = ''
  form.province = ''
  form.city = ''
  form.district = ''
  form.detail = ''
  form.isDefault = false
  isEdit.value = false
}

// 新增地址
function openAdd() {
  resetForm()
  dialogTitle.value = '新增地址'
  dialogVisible.value = true
}

// 编辑地址
function openEdit(addr) {
  isEdit.value = true
  dialogTitle.value = '编辑地址'
  form.id = addr.id
  form.name = addr.name
  form.mobile = addr.mobile
  form.province = addr.province
  form.district = addr.district
  form.detail = addr.detail
  form.isDefault = addr.isDefault
  dialogVisible.value = true
}

// 保存（新增或更新）
async function handleSave() {
  // 表单校验
  if (!form.name.trim()) { ElMessage.warning('请输入收货人姓名'); return }
  if (!form.mobile.trim()) { ElMessage.warning('请输入手机号码'); return }
  if (!form.province.trim() || !form.city.trim() || !form.district.trim()) {
    ElMessage.warning('请填写省/市/区'); return
  }
  if (!form.detail.trim()) { ElMessage.warning('请输入详细地址'); return }

  saving.value = true
  try {
    const data = {
      name: form.name,
      mobile: form.mobile,
      province: form.province,
      city: form.city,
      district: form.district,
      detail: form.detail,
      isDefault: form.isDefault,
    }

    if (isEdit.value) {
      await updateAddress(form.id, data)
      ElMessage.success('地址更新成功')
    } else {
      await addAddress(data)
      ElMessage.success('地址添加成功')
    }
    dialogVisible.value = false
    await fetchAddresses() // 刷新列表
  } catch (e) {
    ElMessage.error('保存失败：' + (e.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

// 删除地址
async function handleDelete(addr) {
  try {
    await ElMessageBox.confirm(
      `确定删除「${addr.province}${addr.city}${addr.district}」的地址吗？`,
      '删除地址',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' },
    )
    await deleteAddress(addr.id)
    ElMessage.success('地址已删除')
    await fetchAddresses() // 刷新列表
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败：' + (e.message || '未知错误'))
    }
  }
}
</script>

<template>
  <div class="address-panel">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" size="small" class="add-btn" @click="openAdd">
        <span class="add-btn__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        新增地址
      </el-button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-text">加载中...</div>

    <!-- 地址列表 -->
    <div v-else-if="addresses.length" class="address-list">
      <div v-for="addr in addresses" :key="addr.id" class="address-card glass">
        <div class="addr-header">
          <strong class="addr-name">{{ addr.name }}</strong>
          <span class="phone">{{ addr.mobile }}</span>
          <el-tag v-if="addr.isDefault" size="small" type="danger" effect="light">默认</el-tag>
        </div>
        <p class="addr-detail">
          {{ addr.province }}{{ addr.city }}{{ addr.district }} {{ addr.detail }}
        </p>
        <div class="addr-actions">
          <el-button size="small" text @click="openEdit(addr)">编辑</el-button>
          <el-button size="small" text type="danger" @click="handleDelete(addr)">删除</el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty glass">
      <p class="empty__text">暂无收货地址</p>
      <p class="empty__hint">点击上方「新增地址」开始添加</p>
    </div>

    <!-- ============ 新增/编辑对话框 ============ -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="90%" :style="{ maxWidth: '480px' }" class="addr-dialog">
      <el-form label-position="top">
        <el-form-item label="收货人">
          <el-input v-model="form.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="省">
              <el-input v-model="form.province" placeholder="省" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市">
              <el-input v-model="form.city" placeholder="市" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区">
              <el-input v-model="form.district" placeholder="区" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址">
          <el-input v-model="form.detail" placeholder="街道、门牌号等" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="saving" @click="handleSave">
          {{ isEdit ? '保存修改' : '添加地址' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.address-panel {
  animation: fadeIn 0.3s var(--ease-out);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.toolbar { margin-bottom: 14px; }

/* 新增地址按钮（品牌渐变 CTA） */
.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.add-btn__icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
}
.add-btn__icon svg { width: 16px; height: 16px; }
.address-panel :deep(.el-button--primary) {
  background: var(--brand-gradient);
  border: none;
  box-shadow: var(--shadow-brand);
}
.address-panel :deep(.el-button--primary:hover) {
  background: var(--brand-gradient);
  filter: brightness(1.04);
  box-shadow: 0 10px 26px rgba(255, 71, 87, 0.32);
}

.loading-text {
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  font-size: var(--text-md);
}

/* ---------- 地址卡片（玻璃 + 悬浮抬升） ---------- */
.address-card {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 18px;
  margin-bottom: 14px;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-1) var(--ease-out);
}
.address-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border-color: var(--primary-light);
}
.addr-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.addr-name { font-size: var(--text-md); color: var(--text-primary); }
.phone { color: var(--text-muted); font-size: var(--text-sm); }
.addr-detail {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 10px;
  line-height: 1.5;
}
.addr-actions {
  display: flex;
  gap: 4px;
  border-top: 1px solid var(--border-light);
  padding-top: 10px;
}

/* ---------- 空状态 ---------- */
.empty {
  text-align: center;
  padding: 40px 20px;
  border-radius: var(--radius-lg);
}
.empty__text {
  margin: 0 0 6px;
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-secondary);
}
.empty__hint {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ---------- 对话框细化 ---------- */
.address-panel :deep(.addr-dialog .el-dialog) {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.address-panel :deep(.addr-dialog .el-dialog__header) {
  padding: 22px 22px 0;
}
.address-panel :deep(.addr-dialog .el-dialog__body) {
  padding: 18px 22px;
}
.address-panel :deep(.addr-dialog .el-dialog__footer) {
  padding: 0 22px 22px;
}
</style>
