<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()

// ============ 实时倒计时（真实交互） ============
// 目标结束时间：挂载时设定一个未来时刻，setInterval 每秒重算剩余 hh:mm:ss
const endTime = ref(Date.now() + (5 * 3600 + 23 * 60 + 42) * 1000)
const remaining = ref({ h: '00', m: '00', s: '00' })
let timer = null

function tick() {
  const diff = endTime.value - Date.now()
  if (diff <= 0) {
    remaining.value = { h: '00', m: '00', s: '00' }
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }
  const total = Math.floor(diff / 1000)
  remaining.value = {
    h: String(Math.floor(total / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0'),
  }
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
// 组件卸载必须清理定时器，避免内存泄漏 / 控制台告警
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ============ 秒杀数据（mock） ============
// status: 'live' 进行中 | 'upcoming' 即将开始 | 'ended' 已结束
// sold: 已抢百分比（驱动进度条）
const flashItems = ref([
  {
    id: 'f-iphone15', productId: 1, name: 'iPhone 15 Pro 256G', image: '/images/iphone15.jpg',
    originalPrice: 8999, flashPrice: 7299, sold: 68, status: 'live',
  },
  {
    id: 'f-macbook', productId: 3, name: 'MacBook Air M3', image: '/images/macbook.jpg',
    originalPrice: 8999, flashPrice: 6799, sold: 41, status: 'live',
  },
  {
    id: 'f-dyson', productId: 5, name: 'Dyson V12 吸尘器', image: '/images/dyson.jpg',
    originalPrice: 4290, flashPrice: 2999, sold: 83, status: 'live',
  },
  {
    id: 'f-sonyxm5', productId: 4, name: 'Sony WH-1000XM5', image: '/images/sonyxm5.jpg',
    originalPrice: 2899, flashPrice: 1999, sold: 56, status: 'live',
  },
  {
    id: 'f-mate60', productId: 2, name: '华为 Mate 60 Pro', image: '/images/mate60.jpg',
    originalPrice: 6999, flashPrice: 5799, sold: 0, status: 'upcoming',
  },
  {
    id: 'f-mitv', productId: 9, name: '小米电视 S Pro 75"', image: '/images/mitv.jpg',
    originalPrice: 5599, flashPrice: 3999, sold: 0, status: 'upcoming',
  },
  {
    id: 'f-aj1', productId: 6, name: 'Air Jordan 1 Mid', image: '/images/aj1.jpg',
    originalPrice: 1199, flashPrice: 799, sold: 100, status: 'ended',
  },
  {
    id: 'f-ipadair', productId: 11, name: 'iPad Air 11" M2', image: '/images/ipadair.jpg',
    originalPrice: 4799, flashPrice: 3899, sold: 100, status: 'ended',
  },
])

const tabs = [
  { key: 'live', label: '进行中' },
  { key: 'upcoming', label: '即将开始' },
  { key: 'ended', label: '已结束' },
]
const activeTab = ref('live')

const visibleItems = computed(() =>
  flashItems.value.filter((i) => i.status === activeTab.value),
)

function discount(item) {
  const d = (item.flashPrice / item.originalPrice) * 10
  return d.toFixed(1)
}

function goDetail(item) {
  // 秒杀商品复用普通详情路由（用真实商品主键，后端可正确核价/扣库存）
  router.push({ name: 'ProductDetail', params: { id: item.productId } })
}

function buyNow(item) {
  if (item.status !== 'live') return
  const payload = {
    id: item.productId, // 真实商品主键，下单时后端能正确核价与扣库存
    name: item.name,
    image: item.image,
    price: item.flashPrice,
    quantity: 1,
    isFlash: true, // 标记秒杀，结算时后端按秒杀价核价
  }
  cartStore.addToCart(payload)
  ElMessage.success(`已将「${item.name}」加入购物车`)
}
</script>

<template>
  <div class="flash">
    <!-- ============ 倒计时 Hero（玻璃横幅） ============ -->
    <section class="flash-hero section--bleed" v-reveal>
      <div class="flash-hero__glow" aria-hidden="true"></div>
      <div class="flash-hero__glass glass glass--strong">
        <div class="flash-hero__left">
          <span class="flash-hero__eyebrow">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
            限时秒杀 · 活动专场
          </span>
          <h1 class="flash-hero__title font-display">整点开抢，手慢无</h1>
          <p class="flash-hero__sub">精选数码爆款，品牌直降，限量库存抢完即止</p>
        </div>

        <div class="flash-hero__count">
          <span class="flash-hero__count-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            距本场结束
          </span>
          <div class="flash-hero__clock font-display">
            <span class="flash-hero__digit">{{ remaining.h }}</span>
            <span class="flash-hero__colon">:</span>
            <span class="flash-hero__digit">{{ remaining.m }}</span>
            <span class="flash-hero__colon">:</span>
            <span class="flash-hero__digit">{{ remaining.s }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 标签页 + 商品楼层 ============ -->
    <section class="flash-list" v-reveal>
      <div class="section__head">
        <h2 class="section__title">本场好物</h2>
      </div>

      <div class="flash-tabs" role="tablist">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="flash-tabs__btn"
          :class="{ 'is-active': activeTab === t.key }"
          role="tab"
          :aria-selected="activeTab === t.key"
          @click="activeTab = t.key"
        >
          {{ t.label }}
          <span class="flash-tabs__count">{{ flashItems.filter((i) => i.status === t.key).length }}</span>
        </button>
      </div>

      <div v-if="visibleItems.length" class="flash-grid">
        <article
          v-for="item in visibleItems"
          :key="item.id"
          class="flash-card glass"
          :class="{ 'is-ended': item.status === 'ended', 'is-upcoming': item.status === 'upcoming' }"
          @click="goDetail(item)"
        >
          <!-- 折扣角标 -->
          <span class="flash-card__badge">{{ discount(item) }} 折</span>

          <!-- 图片 -->
          <div class="flash-card__media">
            <img :src="item.image" :alt="item.name" loading="lazy" />
            <span v-if="item.status === 'ended'" class="flash-card__mask">已抢光</span>
            <span v-else-if="item.status === 'upcoming'" class="flash-card__mask flash-card__mask--soft">即将开始</span>
          </div>

          <!-- 信息 -->
          <div class="flash-card__body">
            <h3 class="flash-card__name">{{ item.name }}</h3>

            <!-- 抢购进度 -->
            <div class="flash-card__progress">
              <div class="flash-card__bar">
                <div class="flash-card__fill" :style="{ width: item.sold + '%' }"></div>
              </div>
              <span class="flash-card__sold">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3 .5 1 1.5 1.5 1.5 1.5C10 7 11 4 12 3z" />
                </svg>
                已抢 {{ item.sold }}%
              </span>
            </div>

            <!-- 价格 -->
            <div class="flash-card__price">
              <span class="flash-card__now font-display">¥{{ item.flashPrice }}</span>
              <span class="flash-card__was">¥{{ item.originalPrice }}</span>
            </div>

            <!-- 动作 -->
            <button
              class="btn btn--primary btn--block flash-card__cta"
              :disabled="item.status !== 'live'"
              @click.stop="buyNow(item)"
            >
              <svg v-if="item.status === 'live'" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <svg v-else-if="item.status === 'upcoming'" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {{ item.status === 'live' ? '马上抢' : item.status === 'upcoming' ? '提醒我' : '已结束' }}
            </button>
          </div>
        </article>
      </div>

      <div v-else class="flash-empty state">
        <div class="state__text">该场次暂无可展示商品</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.flash {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(16px, 5vw, 40px);
  padding-block: var(--section-gap) var(--section-gap);
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

/* ============ Hero 倒计时 ============ */
.flash-hero {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.flash-hero__glow {
  position: absolute;
  inset: 0;
  background: var(--brand-gradient-soft);
  z-index: 0;
}
.flash-hero__glass {
  position: relative;
  z-index: 1;
  border-radius: var(--radius-xl);
  padding: clamp(22px, 4vw, 40px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}
.flash-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 10px;
}
.flash-hero__title {
  font-size: var(--text-4xl);
  line-height: 1.1;
  margin: 0 0 10px;
  color: var(--text-primary);
}
.flash-hero__sub {
  margin: 0;
  font-size: var(--text-md);
  color: var(--text-secondary);
  max-width: 38ch;
}
.flash-hero__count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.flash-hero__count-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.flash-hero__clock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: clamp(34px, 6vw, 52px);
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.flash-hero__digit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4ch;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}
.flash-hero__colon {
  color: var(--primary);
  opacity: 0.55;
  animation: flash-blink 1s steps(1) infinite;
}
@keyframes flash-blink {
  50% { opacity: 0.2; }
}

/* ============ 标签页 ============ */
.flash-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}
.flash-tabs__btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--bg-white);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color var(--dur-1) var(--ease-out),
    color var(--dur-1) var(--ease-out),
    background-color var(--dur-1) var(--ease-out);
}
.flash-tabs__btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.flash-tabs__btn.is-active {
  background: var(--brand-gradient);
  color: #fff;
  border-color: transparent;
  box-shadow: var(--shadow-brand);
}
.flash-tabs__count {
  font-size: var(--text-xs);
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--glass-bg-strong);
  color: inherit;
}
.flash-tabs__btn:not(.is-active) .flash-tabs__count {
  background: var(--surface-2);
  color: var(--text-muted);
}

/* ============ 商品网格 ============ */
.flash-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (min-width: 768px) {
  .flash-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
}
@media (min-width: 1024px) {
  .flash-grid { grid-template-columns: repeat(4, 1fr); }
}

.flash-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}
.flash-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-brand);
  border-color: var(--primary-light);
}
.flash-card.is-ended,
.flash-card.is-upcoming {
  cursor: default;
}
.flash-card.is-ended:hover,
.flash-card.is-upcoming:hover {
  transform: none;
  box-shadow: var(--shadow-md);
  border-color: var(--glass-border);
}

.flash-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  color: #fff;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-sm);
}

.flash-card__media {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: var(--surface-2);
  overflow: hidden;
}
.flash-card__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-3) var(--ease-out);
}
.flash-card:hover .flash-card__media img {
  transform: scale(1.06);
}
.flash-card__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #fff;
  background: color-mix(in srgb, var(--ink) 52%, transparent);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}
.flash-card__mask--soft {
  color: var(--text-primary);
  background: var(--glass-bg-strong);
}

.flash-card__body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.flash-card__name {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.flash-card__progress {
  display: flex;
  align-items: center;
  gap: 8px;
}
.flash-card__bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: var(--surface-2);
  overflow: hidden;
}
.flash-card__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--brand-gradient);
  transition: width var(--dur-3) var(--ease-out);
}
.flash-card__sold {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.flash-card__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.flash-card__now {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}
.flash-card__was {
  font-size: var(--text-sm);
  color: var(--text-placeholder);
  text-decoration: line-through;
}

.flash-card__cta {
  margin-top: auto;
}

.flash-empty {
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
}

/* 减弱动效偏好：关闭冒号闪烁 */
@media (prefers-reduced-motion: reduce) {
  .flash-hero__colon { animation: none; }
  .flash-card__media img { transition: none; }
}
</style>
