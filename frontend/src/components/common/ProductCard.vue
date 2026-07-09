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
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-card__image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f9f9f9;
  overflow: hidden;
}

.product-card__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.tag {
  position: absolute;
  top: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.tag--new {
  left: 8px;
  background: #ff4757;
}

.tag--hot {
  right: 8px;
  background: #ff6348;
}

.product-card__info {
  padding: 12px;
}

.product-card__name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 10px;
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
  font-size: 18px;
  font-weight: 700;
  color: #ff4757;
}

.product-card__original {
  font-size: 12px;
  color: #ccc;
  text-decoration: line-through;
}

.product-card__sales {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

/* 底部插槽区域 */
.product-card__footer {
  padding: 0 12px 12px;
}
</style>
