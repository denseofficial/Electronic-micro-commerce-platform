<script setup>
import { useRouter } from 'vue-router'
import { formatPrice } from '../../utils/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

function goDetail() {
  router.push({ name: 'ProductDetail', params: { id: props.product.id } })
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
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
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

.tag {
  position: absolute;
  top: 10px;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
  backdrop-filter: blur(2px);
}

.tag--new {
  left: 10px;
  background: var(--primary);
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

/* 底部插槽区域 */
.product-card__footer {
  padding: 0 14px 14px;
}
</style>
