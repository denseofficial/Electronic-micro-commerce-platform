<script setup>
import { useRouter } from 'vue-router'
import { formatPrice } from '../../utils/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

// 快捷加购：向上抛出 add 事件，由父页面决定具体行为（如弹窗/直接加购）
const emit = defineEmits(['add'])

const router = useRouter()

function goDetail() {
  router.push({ name: 'ProductDetail', params: { id: props.product.id } })
}
function onQuickAdd(e) {
  e.stopPropagation()
  emit('add', props.product)
}
</script>

<template>
  <div class="product-card" @click="goDetail">
    <!-- 图片区域 -->
    <div class="product-card__image">
      <img :src="product.image" :alt="product.name" loading="lazy" />

      <!--
        ============ 具名插槽 #tags ============
        父组件可通过 <template #tags> 自定义标签区域
        默认显示新品/热卖标签
      -->
      <slot name="tags">
        <span v-if="product.isNew" class="tag tag--new">新品</span>
        <span v-if="product.isHot" class="tag tag--hot">热卖</span>
      </slot>

      <!-- 签名动作：悬停浮现的快捷加购按钮 -->
      <button
        class="product-card__quick"
        aria-label="加入购物车"
        @click="onQuickAdd"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </button>
    </div>

    <!-- 信息区域 -->
    <div class="product-card__info">
      <!-- 默认插槽：可完全替换信息区域内容 -->
      <slot>
        <h3 class="product-card__name">{{ product.name }}</h3>
        <p class="product-card__desc">{{ product.description }}</p>
        <div class="product-card__bottom">
          <span class="product-card__price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice > product.price" class="product-card__original">
            {{ formatPrice(product.originalPrice) }}
          </span>
          <span class="product-card__sales">已售 {{ product.sales }}</span>
        </div>
      </slot>
    </div>

    <!--
      ============ 具名插槽 #footer ============
      父组件可通过 <template #footer> 添加底部操作区
    -->
    <div v-if="$slots.footer" class="product-card__footer" @click.stop>
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.product-card {
  position: relative;
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-brand);
  border-color: var(--primary-light);
}

.product-card__image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: var(--surface-2);
  overflow: hidden;
}
.product-card__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-3) var(--ease-out);
}
.product-card:hover .product-card__image img {
  transform: scale(1.06);
}

/* 悬停浮现的快捷加购按钮（签名动作之一） */
.product-card__quick {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: var(--brand-gradient);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}
.product-card:hover .product-card__quick {
  opacity: 1;
  transform: translateY(0);
}
.product-card__quick:hover {
  box-shadow: 0 8px 22px rgba(255, 71, 87, 0.4);
}

.tag {
  position: absolute;
  top: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
}
.tag--new {
  left: 10px;
  background: var(--brand-gradient);
}
.tag--hot {
  right: 10px;
  background: var(--warning);
}

.product-card__info {
  padding: 14px;
}
.product-card__name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--dur-1) var(--ease-out);
}
.product-card:hover .product-card__name {
  color: var(--primary);
}
.product-card__desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-card__bottom {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}
.product-card__price {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}
.product-card__original {
  font-size: var(--text-sm);
  color: var(--text-placeholder);
  text-decoration: line-through;
}
.product-card__sales {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-left: auto;
}

.product-card__footer {
  padding: 0 14px 14px;
}
</style>
