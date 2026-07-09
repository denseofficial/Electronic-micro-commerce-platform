<script setup>
import { computed } from 'vue'

const props = defineProps({
  specs: {
    type: Object,
    required: true,
    // 校验：必须为非空对象
    validator: (val) => !!val && typeof val === 'object',
  },
})

// 将 { key: value } 对象转为 el-table 需要的数组结构
const specRows = computed(() =>
  Object.entries(props.specs).map(([name, value]) => ({ name, value })),
)
</script>

<template>
  <el-table :data="specRows" border size="small" class="spec-table">
    <el-table-column prop="name" label="参数" width="140" align="center" />
    <el-table-column prop="value" label="规格" />
  </el-table>
</template>

<style scoped>
.spec-table {
  margin-top: 8px;
  font-size: 13px;
}
</style>
