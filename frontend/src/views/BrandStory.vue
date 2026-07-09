<script setup>
// ============ 品牌故事 — 编辑式滚动叙事 ============
// 全站设计系统：玻璃质感 + 品牌渐变 + 展示字体（Space Grotesk / Noto Sans SC）
// 仅使用 style.css / design-upgrades.css 中已定义的令牌，不硬编码颜色。
import BrandMarquee from '../components/vuebits/BrandMarquee.vue'

// 里程碑（纵向时间线，玻璃卡片）
const milestones = [
  { year: '2019', title: '一间街角小店', desc: '从 12 平米的街角出发，只卖我们真心喜欢、也愿意推荐给朋友的东西。' },
  { year: '2021', title: '微商城上线', desc: '把"选品"这件事搬到线上，让好物跨越城市与距离，抵达更多人手中。' },
  { year: '2023', title: '三级严选体系', desc: '建立品控、实测与复盘机制，每一件上架，都经得起反复推敲。' },
  { year: '2025', title: '百万份信任', desc: '服务超过 120 万用户，关于好物的故事，仍在继续书写。' },
]

// 价值主张（bento 网格，内联 SVG 图标，1.8px 描边）
const values = [
  {
    key: 'v1',
    title: '甄选品质',
    text: '不是货架上的全部，而是我们替你筛过的少数。每一件都经过真实使用与对比，留下真正值得的。',
  },
  { key: 'v2', title: '极速履约', text: '下单即进入履约流程，平均 48 小时送达，好物不让你等太久。' },
  { key: 'v3', title: '透明定价', text: '价格、参数、售后一目了然，没有套路，也没有隐藏的"惊喜"。' },
  { key: 'v4', title: '贴心服务', text: '从售前咨询到售后跟进，24/7 在线，把每一次相遇都当作长期的开始。' },
]

// 数据带（玻璃质感大数字，增添"数据"纹理）
const stats = [
  { num: '120万+', label: '信赖我们的用户' },
  { num: '98.6%', label: '订单准时履约率' },
  { num: '48h', label: '平均送达时长' },
  { num: '24/7', label: '在线客服陪伴' },
]

// 橱窗横滑货架（玻璃相框包裹，编辑式影像节奏）
const gallery = [
  { src: '/images/macbook.jpg', label: '轻薄生产力' },
  { src: '/images/sonyxm5.jpg', label: '沉浸之声' },
  { src: '/images/dyson.jpg', label: '空气与美' },
  { src: '/images/mate60.jpg', label: '旗舰影像' },
  { src: '/images/mitv.jpg', label: '客厅中心' },
  { src: '/images/aj1.jpg', label: '街头态度' },
]

// 锚点平滑滚动（避免改动 hash 路由）
function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
  <div class="brand-story">
    <!-- ============ 全宽 Hero ============ -->
    <section class="hero section--bleed" v-reveal>
      <div class="hero__inner">
        <div class="hero__copy">
          <span class="chip hero__eyebrow">品牌故事 · OUR STORY</span>
          <h1 class="hero__title font-display">把好物，<br />讲成一个故事。</h1>
          <p class="hero__tagline">
            我们相信，每一件值得拥有的东西，背后都有一段值得讲述的缘由。
            电子微商城，是这些故事的收集者与讲述者。
          </p>
          <div class="hero__actions">
            <router-link :to="{ name: 'ProductList' }" class="btn btn--primary">
              逛逛商城
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </router-link>
            <button type="button" class="btn btn--ghost" @click="scrollToId('manifesto')">
              了解我们的理念
            </button>
          </div>
        </div>

        <div class="hero__media">
          <div class="hero__frame glass">
            <img src="/images/iphone15.jpg" alt="精选好物" width="520" height="640"
                 loading="eager" decoding="async" />
            <span class="hero__badge glass">本季真爱 · iPhone 15</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 品牌跑马灯（动效 / 节奏） ============ -->
    <BrandMarquee :items="[' Apple ', ' 索尼 ', ' 戴森 ', ' 小米 ', ' 华为 ', ' 任天堂 ']" />

    <!-- ============ 理念 / 宣言（非对称编辑式） ============ -->
    <section id="manifesto" class="manifesto" v-reveal="{ delay: 60 }">
      <div class="manifesto__grid">
        <div class="manifesto__statement">
          <span class="manifesto__kicker font-display">我们的理念</span>
          <p class="manifesto__quote font-display">
            少一点喧嚣，<br />多一点<em>值得</em>。
          </p>
        </div>
        <div class="manifesto__body">
          <p>
            市面上的选择越来越多，但"值得买"的东西并没有变多。
            我们想做的，是把噪音过滤掉，只把真正经得起日常检验的好物，递到你面前。
          </p>
          <p>
            所以这里有克制，也有诚意——克在于不堆砌，诚在于敢说真话。
            我们希望你买到的每一件，都像被朋友认真推荐过那样安心。
          </p>
          <div class="manifesto__frame glass">
            <img src="/images/csbook.jpg" alt="关于好物的书" width="480" height="320"
                 loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 里程碑 / 时间线（纵向，玻璃卡片） ============ -->
    <section class="timeline" v-reveal>
      <div class="section__head">
        <h2 class="section__title">一路走来</h2>
        <span class="section__more">2019 — 2025</span>
      </div>
      <div class="timeline__list">
        <div v-for="m in milestones" :key="m.year" class="tl-item">
          <div class="tl-card glass">
            <span class="tl-year font-display">{{ m.year }}</span>
            <h3 class="tl-title">{{ m.title }}</h3>
            <p class="tl-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 价值主张 Bento 网格 ============ -->
    <section id="values" class="values" v-reveal>
      <div class="section__head">
        <h2 class="section__title">我们坚持的事</h2>
      </div>
      <div class="values__grid">
        <article class="v-card glass v1">
          <span class="v-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3h12l3 6-9 12L3 9l3-6z" />
              <path d="M3 9h18" />
              <path d="M9 3 6 9l6 12 6-12-3-6" />
            </svg>
          </span>
          <h3 class="v-title">{{ values[0].title }}</h3>
          <p class="v-text">{{ values[0].text }}</p>
        </article>

        <article class="v-card glass v2">
          <span class="v-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
          </span>
          <h3 class="v-title">{{ values[1].title }}</h3>
          <p class="v-text">{{ values[1].text }}</p>
        </article>

        <article class="v-card glass v3">
          <span class="v-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <h3 class="v-title">{{ values[2].title }}</h3>
          <p class="v-text">{{ values[2].text }}</p>
        </article>

        <article class="v-card glass v4">
          <span class="v-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
              <rect x="3" y="13" width="4" height="7" rx="2" />
              <rect x="17" y="13" width="4" height="7" rx="2" />
              <path d="M21 18v1a3 3 0 0 1-3 3h-4" />
            </svg>
          </span>
          <h3 class="v-title">{{ values[3].title }}</h3>
          <p class="v-text">{{ values[3].text }}</p>
        </article>
      </div>
    </section>

    <!-- ============ 橱窗横滑货架（编辑式影像） ============ -->
    <section class="showcase" v-reveal>
      <div class="section__head">
        <h2 class="section__title">本季橱窗</h2>
        <span class="section__more">左右滑动探索 ›</span>
      </div>
      <div class="rail">
        <figure v-for="g in gallery" :key="g.src" class="show-card glass">
          <img :src="g.src" :alt="g.label" width="280" height="220"
               loading="lazy" decoding="async" />
          <figcaption>{{ g.label }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- ============ 数据带（玻璃大数字） ============ -->
    <section class="stats" v-reveal>
      <div class="stats__grid">
        <div v-for="s in stats" :key="s.label" class="stat glass">
          <span class="stat__num font-display">{{ s.num }}</span>
          <span class="stat__label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ============ 收尾 CTA ============ -->
    <section class="cta section--bleed" v-reveal>
      <div class="cta__panel glass glass--strong">
        <h2 class="cta__title font-display">故事还在继续，<br />好物等你来挑。</h2>
        <p class="cta__sub">把这份用心，带回到你的日常里。</p>
        <router-link :to="{ name: 'ProductList' }" class="btn btn--primary cta__btn">
          进入商城
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.brand-story {
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

/* ============ Hero ============ */
.hero {
  background: var(--brand-gradient-soft);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.hero__inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: clamp(24px, 4vw, 56px);
  padding: clamp(36px, 6vw, 72px) 0;
  max-width: 1200px;
  margin: 0 auto;
}
.hero__eyebrow {
  margin-bottom: 18px;
}
.hero__title {
  font-size: clamp(34px, 6vw, 64px);
  line-height: 1.05;
  font-weight: 800;
  margin: 0 0 20px;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.hero__tagline {
  font-size: var(--text-lg);
  line-height: var(--lh-body);
  color: var(--text-secondary);
  max-width: 46ch;
  margin: 0 0 30px;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.hero__media {
  display: flex;
  justify-content: center;
}
.hero__frame {
  position: relative;
  padding: 14px;
  border-radius: var(--radius-lg);
  transform: rotate(-1.5deg);
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
  box-shadow: var(--shadow-lg);
}
.hero__frame:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-brand);
}
.hero__frame img {
  width: 100%;
  max-width: 320px;
  height: auto;
  aspect-ratio: 520 / 640;
  object-fit: cover;
  border-radius: var(--radius-md);
}
.hero__badge {
  position: absolute;
  left: -14px;
  bottom: 22px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--primary);
  box-shadow: var(--shadow-md);
}

/* ============ 理念 / 宣言 ============ */
.manifesto__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(28px, 5vw, 72px);
  align-items: start;
}
.manifesto__kicker {
  display: inline-block;
  font-size: var(--text-sm);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 18px;
}
.manifesto__quote {
  font-size: clamp(30px, 4.6vw, 52px);
  line-height: 1.12;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}
.manifesto__quote em {
  font-style: normal;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.manifesto__body p {
  color: var(--text-secondary);
  font-size: var(--text-md);
  line-height: var(--lh-body);
  margin: 0 0 16px;
}
.manifesto__frame {
  margin-top: 12px;
  padding: 12px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.manifesto__frame img {
  width: 100%;
  aspect-ratio: 480 / 320;
  object-fit: cover;
  border-radius: var(--radius-md);
}

/* ============ 时间线 ============ */
.timeline__list {
  position: relative;
  display: grid;
  gap: 18px;
}
.timeline__list::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: var(--border);
}
.tl-item {
  position: relative;
  padding-left: 48px;
}
.tl-item::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 24px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--brand-gradient);
  box-shadow: 0 0 0 4px var(--bg-page);
}
.tl-card {
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
}
.tl-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
.tl-year {
  display: inline-block;
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 6px;
}
.tl-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.tl-desc {
  margin: 0;
  font-size: var(--text-md);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}

/* ============ 价值 Bento ============ */
.values__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'v1 v2 v3'
    'v1 v4 v4';
  gap: var(--rail-gap);
}
.v-card {
  padding: 24px;
  border-radius: var(--radius-lg);
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-light);
}
.v1 { grid-area: v1; }
.v2 { grid-area: v2; }
.v3 { grid-area: v3; }
.v4 { grid-area: v4; }
.v-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
  margin-bottom: 16px;
}
.v-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 10px;
}
.v1 .v-title {
  font-size: var(--text-2xl);
}
.v-text {
  margin: 0;
  font-size: var(--text-md);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}

/* ============ 橱窗横滑 ============ */
.show-card {
  margin: 0;
  padding: 12px;
  border-radius: var(--radius-lg);
  scroll-snap-align: start;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
}
.show-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.show-card img {
  width: 100%;
  aspect-ratio: 280 / 220;
  object-fit: cover;
  border-radius: var(--radius-md);
}
.show-card figcaption {
  padding: 12px 6px 4px;
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
}

/* ============ 数据带 ============ */
.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--rail-gap);
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 26px 22px;
  border-radius: var(--radius-lg);
  text-align: center;
}
.stat__num {
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  line-height: 1;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.stat__label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ============ 收尾 CTA ============ */
.cta {
  padding-inline: var(--bleed-pad);
}
.cta__panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px);
  border-radius: var(--radius-xl);
  text-align: center;
  background: var(--brand-gradient-soft);
  box-shadow: var(--shadow-lg);
}
.cta__title {
  font-size: clamp(28px, 4.4vw, 48px);
  font-weight: 800;
  line-height: 1.12;
  color: var(--text-primary);
  margin: 0 0 14px;
}
.cta__sub {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0 0 28px;
}
.cta__btn {
  font-size: var(--text-lg);
  padding: 14px 32px;
}

/* ============ 响应式 ============ */
@media (max-width: 1024px) {
  .hero__inner {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .hero__media {
    justify-content: flex-start;
  }
  .manifesto__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .values__grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'v1 v1'
      'v2 v3'
      'v4 v4';
  }
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero__frame img {
    max-width: 260px;
  }
}

@media (max-width: 640px) {
  .values__grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'v1'
      'v2'
      'v3'
      'v4';
  }
  .stats__grid {
    grid-template-columns: 1fr 1fr;
  }
  .hero__actions .btn {
    flex: 1 1 auto;
  }
}
</style>
