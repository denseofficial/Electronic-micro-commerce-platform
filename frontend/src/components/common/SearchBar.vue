<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '搜索商品...' },
})

const emit = defineEmits(['update:modelValue', 'search'])

const keyword = ref(props.modelValue)

function handleSubmit() {
  emit('search', keyword.value.trim())
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="keyword"
      type="text"
      class="search-bar__input"
      :placeholder="placeholder"
      @keyup.enter="handleSubmit"
    />
    <button class="search-bar__btn" @click="handleSubmit">
      🔍
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ff4757;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
}

.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 16px;
  font-size: 14px;
  background: transparent;
  color: #333;
}

.search-bar__btn {
  border: none;
  background: none;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.search-bar__btn:hover {
  transform: scale(1.15);
}
</style>
