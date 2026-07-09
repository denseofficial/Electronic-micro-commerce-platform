<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

// ============ 会员等级阶梯（青铜 / 白银 / 黄金 / 钻石） ============
const TIERS = [
  {
    key: 'bronze',
    name: '青铜会员',
    min: 0,
    benefits: ['全场包邮', '生日专属礼券', '积分翻倍日'],
  },
  {
    key: 'silver',
    name: '白银会员',
    min: 500,
    benefits: ['青铜全部权益', '7×12 专属客服', '每月免邮券 ×1'],
  },
  {
    key: 'gold',
    name: '黄金会员',
    min: 1000,
    benefits: ['白银全部权益', '新品优先购', '积分加速 1.5×'],
  },
  {
    key: 'diamond',
    name: '钻石会员',
    min: 2000,
    benefits: ['黄金全部权益', '全年免邮特权', '专属管家 + 大额券'],
  },
]

// ============ 当前会员状态（mock，可由接口覆盖） ============
const authStore = useAuthStore()
const currentTierKey = 'gold'
const points = ref(1680)

const currentTierIndex = computed(() =>
  TIERS.findIndex((t) => t.key === currentTierKey),
)
const currentTier = computed(() => TIERS[currentTierIndex.value])
const nextTier = computed(() => TIERS[currentTierIndex.value + 1] || null)

const pointsToNext = computed(() =>
  nextTier.value ? Math.max(0, nextTier.value.min - points.value) : 0,
)

const progressPct = computed(() => {
  if (!nextTier.value) return 100
  const lo = currentTier.value.min
  const hi = nextTier.value.min
  if (hi <= lo) return 100
  return Math.max(0, Math.min(100, ((points.value - lo) / (hi - lo)) * 100))
})

// 进度条入场动画：从 0 平滑填充到目标值
const displayPct = ref(0)
onMounted(() => {
  requestAnimationFrame(() => {
    displayPct.value = progressPct.value
  })
})

// ============ 赚积分任务（mock，本地可领取） ============
const tasks = ref([
  {
    key: 'signin',
    title: '每日签到',
    desc: '连续签到领取更多积分',
    points: 10,
    action: '签到',
    claimed: false,
  },
  {
    key: 'profile',
    title: '完善资料',
    desc: '补全个人资料立得积分',
    points: 50,
    action: '去完成',
    claimed: false,
  },
  {
    key: 'review',
    title: '评价订单',
    desc: '为已完成订单写评价',
    points: 20,
    action: '去完成',
    claimed: false,
  },
  {
    key: 'share',
    title: '分享商品',
    desc: '分享心仪好物给好友',
    points: 15,
    action: '去完成',
    claimed: false,
  },
])

function claim(task) {
  if (task.claimed) return
  task.claimed = true
}

// ============ 积分明细（mock 6 条） ============
const history = ref([
  { date: '2026-07-08', reason: '每日签到', delta: 10 },
  { date: '2026-07-07', reason: '购买 iPhone 15', delta: 200 },
  { date: '2026-07-06', reason: '评价订单 #88231', delta: 20 },
  { date: '2026-07-05', reason: '兑换 50 元券', delta: -500 },
  { date: '2026-07-03', reason: '分享商品', delta: 15 },
  { date: '2026-07-01', reason: '完善个人资料', delta: 50 },
])
</script>

<template>
  <div class="memb">
    <!-- 页头 -->
    <header class="memb__head" v-reveal>
      <h1 class="memb__title font-display">会员中心</h1>
      <p class="memb__sub">欢迎回来，{{ authStore.nickname }}</p>
    </header>

    <!-- 会员英雄卡 -->
    <section class="section" v-reveal>
      <div class="hero glass">
        <div class="hero__glow" aria-hidden="true"></div>

        <div class="hero__top">
          <span class="hero__level">{{ currentTier.name }}</span>
          <span class="hero__name">{{ authStore.nickname }}</span>
        </div>

        <div class="hero__points">
          <span class="hero__points-num font-display">{{ points }}</span>
          <span class="hero__points-label">当前积分</span>
        </div>

        <div class="hero__progress">
          <div
            class="bar"
            role="progressbar"
            :aria-valuenow="Math.round(displayPct)"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`距离${nextTier ? nextTier.name : '至尊'}还差${pointsToNext}积分`"
          >
            <div class="bar__fill" :style="{ width: displayPct + '%' }"></div>
          </div>
          <div class="hero__scale">
            <span class="hero__scale-from">{{ currentTier.name }}</span>
            <span class="hero__scale-to">
              {{ nextTier ? nextTier.name + ' · ' + nextTier.min : '已至尊' }}
            </span>
          </div>
          <p class="hero__hint">
            还差 <b class="hero__hint-num">{{ pointsToNext }}</b> 积分升级{{
              nextTier ? nextTier.name.replace('会员', '') : '至尊'
            }}
          </p>
        </div>
      </div>
    </section>

    <!-- 会员等级阶梯 -->
    <section class="section" v-reveal>
      <div class="section__head">
        <h2 class="section__title">会员等级</h2>
        <span class="section__more">共 {{ TIERS.length }} 个等级</span>
      </div>

      <div class="tiers">
        <article
          v-for="(t, idx) in TIERS"
          :key="t.key"
          :class="[
            'tier',
            'glass',
            {
              'is-current': idx === currentTierIndex,
              'is-locked': idx > currentTierIndex,
            },
          ]"
        >
          <span v-if="idx === currentTierIndex" class="tier__flag">当前</span>

          <span class="tier__icon-wrap" :class="{ 'is-locked': idx > currentTierIndex }">
            <svg
              v-if="idx <= currentTierIndex"
              class="tier__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 3h12l3 6-9 12L3 9z" />
              <path d="M3 9h18" />
              <path d="M9 3 7 9l5 12 5-12-2-6" />
            </svg>
            <svg
              v-else
              class="tier__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>

          <h3 class="tier__name">{{ t.name }}</h3>
          <p class="tier__min">需 {{ t.min }} 积分</p>

          <ul class="tier__benefits">
            <li v-for="b in t.benefits" :key="b" class="tier__benefit">
              <svg
                class="tier__check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{{ b }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- 赚积分任务 -->
    <section class="section" v-reveal>
      <div class="section__head">
        <h2 class="section__title">赚积分</h2>
        <span class="section__more">每日任务</span>
      </div>

      <div class="tasks">
        <article v-for="task in tasks" :key="task.key" class="task glass">
          <span class="task__icon" :class="'task__icon--' + task.key" aria-hidden="true">
            <svg
              v-if="task.key === 'signin'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <svg
              v-else-if="task.key === 'profile'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="9" cy="8" r="4" />
              <path d="M2 21a7 7 0 0 1 14 0" />
              <path d="M18 13l3 3-3 3" />
            </svg>
            <svg
              v-else-if="task.key === 'review'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9z" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </span>

          <div class="task__body">
            <h3 class="task__title">{{ task.title }}</h3>
            <p class="task__desc">{{ task.desc }}</p>
            <span class="task__points">+{{ task.points }} 积分</span>
          </div>

          <button
            class="btn"
            :class="task.claimed ? 'btn--ghost' : 'btn--primary'"
            :disabled="task.claimed"
            @click="claim(task)"
          >
            {{ task.claimed ? (task.key === 'signin' ? '已签到' : '已完成') : task.action }}
          </button>
        </article>
      </div>
    </section>

    <!-- 积分明细 -->
    <section class="section" v-reveal>
      <div class="section__head">
        <h2 class="section__title">积分明细</h2>
      </div>

      <div class="history glass">
        <ul class="history__list">
          <li v-for="(h, i) in history" :key="i" class="history__row">
            <div class="history__meta">
              <span class="history__reason">{{ h.reason }}</span>
              <span class="history__date">{{ h.date }}</span>
            </div>
            <span
              class="history__delta"
              :class="h.delta >= 0 ? 'is-plus' : 'is-minus'"
            >
              {{ h.delta > 0 ? '+' : '' }}{{ h.delta }}
            </span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.memb {
  max-width: 880px;
  margin: 0 auto;
  animation: fadeIn 0.4s var(--ease-out);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.memb__head {
  margin-bottom: 22px;
}
.memb__title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: var(--lh-tight);
}
.memb__sub {
  margin: 6px 0 0;
  font-size: var(--text-md);
  color: var(--text-secondary);
}

/* ---------- 会员英雄卡 ---------- */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  padding: 26px 26px 24px;
}
.hero__glow {
  position: absolute;
  inset: -40% -10% auto auto;
  width: 60%;
  height: 200%;
  background: var(--brand-gradient-soft);
  filter: blur(8px);
  pointer-events: none;
}
.hero__top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.hero__level {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: var(--shadow-brand);
}
.hero__name {
  font-size: var(--text-md);
  color: var(--text-secondary);
  font-weight: 500;
}
.hero__points {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
}
.hero__points-num {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.hero__points-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.hero__progress {
  position: relative;
}
.bar {
  height: 10px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border-light);
  overflow: hidden;
}
.bar__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--brand-gradient);
  transition: width var(--dur-3) var(--ease-out);
}
.hero__scale {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.hero__hint {
  margin: 10px 0 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.hero__hint-num {
  color: var(--primary);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* ---------- 会员等级阶梯 ---------- */
.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}
.tier {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 18px 16px 16px;
  display: flex;
  flex-direction: column;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
}
.tier.is-locked {
  opacity: 0.78;
}
.tier.is-current {
  box-shadow: var(--shadow-brand);
  transform: translateY(-2px);
}
.tier.is-current::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: var(--brand-gradient);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.tier__flag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 10px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 2px 8px;
  border-radius: 999px;
}
.tier__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg);
  color: var(--accent);
  margin-bottom: 12px;
}
.tier__icon-wrap.is-locked {
  background: var(--surface-2);
  color: var(--text-placeholder);
}
.tier__icon {
  width: 24px;
  height: 24px;
}
.tier__name {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}
.tier__min {
  margin: 2px 0 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.tier__benefits {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tier__benefit {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}
.tier__check {
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  margin-top: 2px;
  color: var(--success);
}

/* ---------- 赚积分任务 ---------- */
.tasks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}
.task {
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
}
.task:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.task__icon {
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-bg);
  color: var(--primary);
}
.task__icon--profile {
  background: var(--accent-bg);
  color: var(--accent);
}
.task__icon--review {
  background: var(--accent-bg);
  color: var(--accent);
}
.task__icon--share {
  background: var(--primary-bg);
  color: var(--primary);
}
.task__icon svg {
  width: 24px;
  height: 24px;
}
.task__body {
  flex: 1;
  min-width: 0;
}
.task__title {
  margin: 0;
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}
.task__desc {
  margin: 2px 0 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.45;
}
.task__points {
  display: inline-block;
  margin-top: 6px;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--primary);
}
.task .btn {
  flex: 0 0 auto;
  padding: 8px 16px;
  font-size: var(--text-sm);
}

/* ---------- 积分明细 ---------- */
.history {
  border-radius: var(--radius-lg);
  padding: 6px 4px;
}
.history__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.history__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 14px;
  border-radius: var(--radius-md);
  transition: background var(--dur-1) var(--ease-out);
}
.history__row:hover {
  background: var(--surface-2);
}
.history__row + .history__row {
  border-top: 1px solid var(--border-light);
}
.history__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.history__reason {
  font-size: var(--text-md);
  color: var(--text-primary);
  font-weight: 500;
}
.history__date {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.history__delta {
  flex: 0 0 auto;
  font-size: var(--text-lg);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.history__delta.is-plus {
  color: var(--success);
}
.history__delta.is-minus {
  color: var(--primary);
}

/* ---------- 响应式 ---------- */
@media (max-width: 768px) {
  .hero {
    padding: 22px 18px 20px;
  }
  .hero__points-num {
    font-size: var(--text-3xl);
  }
}
@media (max-width: 480px) {
  .memb__title {
    font-size: var(--text-2xl);
  }
  .task {
    flex-wrap: wrap;
  }
  .task .btn {
    width: 100%;
  }
}
</style>
