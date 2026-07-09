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
      <el-button type="primary" size="small" @click="openAdd">+ 新增地址</el-button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-text">加载中...</div>

    <!-- 地址列表 -->
    <div v-else-if="addresses.length" class="address-list">
      <div v-for="addr in addresses" :key="addr.id" class="address-card">
        <div class="addr-header">
          <strong>{{ addr.name }}</strong>
          <span class="phone">{{ addr.mobile }}</span>
          <el-tag v-if="addr.isDefault" size="small" type="danger">默认</el-tag>
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
    <div v-else class="empty">暂无收货地址，点击上方按钮添加</div>

    <!-- ============ 新增/编辑对话框 ============ -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="90%" :style="{ maxWidth: '480px' }">
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
.address-panel { animation: fadeIn 0.3s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.toolbar { margin-bottom: 12px; }

.loading-text { text-align: center; padding: 20px; color: var(--text-muted); font-size: 14px; }

.address-card {
  background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px;
  position: relative;
  transition: border-color var(--dur-1) var(--ease-out), box-shadow var(--dur-1) var(--ease-out);
}
.address-card:hover { border-color: var(--primary-light); box-shadow: var(--shadow-sm); }
.addr-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.phone { color: var(--text-muted); font-size: 13px; }
.addr-detail { font-size: 13px; color: var(--text-secondary); margin: 0 0 8px; }

.addr-actions {
  display: flex; gap: 4px; border-top: 1px solid var(--border-light); padding-top: 8px;
}

.empty { text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 14px; }
</style>
