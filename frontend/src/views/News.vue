<script setup>
// 玩机资讯 / 攻略 — 编辑式杂志排版（破电商商品网格）
// 头条封面（非对称双栏）+ 可筛选文章流 + 热门话题横滑货架
import { ref, computed } from 'vue'
import HorizontalRail from '../components/common/HorizontalRail.vue'

// ============ 分类筛选 ============
const categories = ['全部', '评测', '攻略', '资讯', '视频']
const activeCategory = ref('全部')

// ============ 模拟文章数据 ============
const articles = ref([
  {
    id: 1,
    title: 'iPhone 15 Pro 深度评测：钛金属之下，影像与性能的再平衡',
    category: '评测',
    excerpt:
      '更轻的机身、更稳的长焦，还有那颗终于够用的「操作按钮」。我们用两周时间把它当作主力机，聊聊它的取舍与惊喜。',
    image: 'iphone15',
    author: '陈野',
    date: '2026-07-08',
    readTime: 12,
  },
  {
    id: 2,
    title: 'Mate 60 系列信号实测：卫星通信到底是不是噱头？',
    category: '攻略',
    excerpt:
      '在无地面网络的山野与海上，我们真的打通了卫星电话。这篇手把手教你什么时候该开、怎么开最省电。',
    image: 'mate60',
    author: '林深',
    date: '2026-07-06',
    readTime: 9,
  },
  {
    id: 3,
    title: '曝旗舰平板将标配 OLED：平板进入显示内卷时代',
    category: '资讯',
    excerpt:
      '供应链消息指明年多款旗舰平板转投 OLED，色彩与对比之外，更便宜的产线才是关键推手。',
    image: 'ipadair',
    author: '苏晚',
    date: '2026-07-05',
    readTime: 6,
  },
  {
    id: 4,
    title: '索尼 WH-1000XM5 长期上手：通勤降噪的舒适区',
    category: '评测',
    excerpt:
      '三个月、三条地铁线、无数次咖啡馆办公之后，它赢在的不是参数，而是「戴着就不想摘下来」。',
    image: 'sonyxm5',
    author: '周野',
    date: '2026-07-03',
    readTime: 8,
  },
  {
    id: 5,
    title: 'MacBook Air 开箱：轻薄与续航的旅行搭档',
    category: '视频',
    excerpt:
      '一支视频带你看过外观、接口与一天真实续航，结尾还有和旧款的重量实测对比。',
    image: 'macbook',
    author: '阿澈',
    date: '2026-07-02',
    readTime: 7,
  },
  {
    id: 6,
    title: '戴森吹风机选购指南：不同发质到底怎么挑？',
    category: '攻略',
    excerpt:
      '细软塌、自然卷、油性头皮各有解法。我们按发质拆开讲，别再为用不上的档位多花钱。',
    image: 'dyson',
    author: '何夕',
    date: '2026-06-30',
    readTime: 10,
  },
  {
    id: 7,
    title: '小米电视 S 系列升级：百寸价格下探意味着什么',
    category: '资讯',
    excerpt:
      '当百寸面板成本被压到新低，客厅大屏的门槛正在快速消失，内容生态却还没跟上。',
    image: 'mitv',
    author: '江临',
    date: '2026-06-28',
    readTime: 5,
  },
  {
    id: 8,
    title: 'AJ1 复刻对比：情怀与做工的拉扯',
    category: '评测',
    excerpt:
      '同一双鞋，不同年份的皮料、走线与鞋型都在变。老玩家教你一眼分辨「正代」与「简版」。',
    image: 'aj1',
    author: '老周',
    date: '2026-06-26',
    readTime: 11,
  },
])

// 当前分类下的文章；头条取第一条，文章流取其余
const filteredArticles = computed(() =>
  activeCategory.value === '全部'
    ? articles.value
    : articles.value.filter((a) => a.category === activeCategory.value),
)
const featured = computed(() => filteredArticles.value[0] || null)
const gridArticles = computed(() => filteredArticles.value.slice(1))

// 热门话题（横滑货架）
const topics = ['影像旗舰', '长续航', '降噪耳机', '折叠屏', '桌面美学', '户外电源', '机械键盘', 'NAS 入门']

function initials(name) {
  return name ? name.trim().charAt(0) : '·'
}
</script>

<template>
  <div class="news">
    <!-- ============ 报头 ============ -->
    <header class="masthead" v-reveal>
      <p class="masthead__kicker">玩机资讯 · 攻略</p>
      <h1 class="masthead__title font-display">玩机志</h1>
      <p class="masthead__sub">深度评测、上手攻略与行业资讯 —— 写给认真玩机的人。</p>
      <span class="masthead__rule" aria-hidden="true"></span>
    </header>

    <!-- ============ 头条封面（非对称双栏） ============ -->
    <section v-if="featured" class="cover" v-reveal>
      <article class="cover__card glass">
        <div class="cover__media">
          <img
            :src="`/images/${featured.image}.jpg`"
            :alt="featured.title"
            loading="lazy"
          />
          <span class="cat-pill cat-pill--accent">{{ featured.category }}</span>
        </div>
        <div class="cover__body">
          <p class="cover__kicker font-display">封面故事</p>
          <h2 class="cover__title font-display">{{ featured.title }}</h2>
          <p class="cover__excerpt">{{ featured.excerpt }}</p>
          <div class="cover__meta">
            <span class="cover__avatar" aria-hidden="true">{{ initials(featured.author) }}</span>
            <span class="cover__author">{{ featured.author }}</span>
            <span class="cover__dot" aria-hidden="true">·</span>
            <span class="meta-item">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                <path d="M3 9h18M8 3v3M16 3v3" />
              </svg>
              {{ featured.date }}
            </span>
            <span class="meta-item">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {{ featured.readTime }} 分钟
            </span>
          </div>
          <a class="cover__link" href="#">
            阅读全文
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </article>
    </section>

    <!-- ============ 分类筛选 + 文章流 ============ -->
    <section class="feed" v-reveal>
      <div class="feed__head">
        <h2 class="section__title font-display">最新文章</h2>
        <span class="feed__count">{{ filteredArticles.length }} 篇</span>
      </div>

      <div class="filter-row" role="tablist" aria-label="文章分类">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-btn"
          :class="{ 'is-active': activeCategory === cat }"
          role="tab"
          :aria-selected="activeCategory === cat"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="gridArticles.length" class="feed__grid">
        <article
          v-for="(a, i) in gridArticles"
          :key="a.id"
          class="card glass"
          v-reveal="{ delay: (i % 6) * 60 }"
        >
          <div class="card__media">
            <img :src="`/images/${a.image}.jpg`" :alt="a.title" loading="lazy" />
          </div>
          <div class="card__body">
            <span class="cat-pill cat-pill--sm">{{ a.category }}</span>
            <h3 class="card__title font-display">{{ a.title }}</h3>
            <p class="card__excerpt">{{ a.excerpt }}</p>
            <div class="card__meta">
              <span class="meta-item">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                  <path d="M3 9h18M8 3v3M16 3v3" />
                </svg>
                {{ a.date }}
              </span>
              <span class="meta-item">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {{ a.readTime }} 分钟
              </span>
            </div>
          </div>
        </article>
      </div>

      <p v-else class="feed__empty">该分类下的更多内容正在筹备中。</p>
    </section>

    <!-- ============ 热门话题横滑货架 ============ -->
    <HorizontalRail title="热门话题" more="查看全部">
      <button v-for="t in topics" :key="t" class="topic-chip glass" type="button">
        # {{ t }}
      </button>
    </HorizontalRail>
  </div>
</template>

<style scoped>
.news {
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

/* ---------- 通用图标 ---------- */
.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: var(--icon-stroke);
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- 分类玻璃药丸 ---------- */
.cat-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--glass-bg-strong);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  color: var(--text-secondary);
}
.cat-pill--accent {
  color: var(--accent);
}
.cat-pill--sm {
  font-size: 11px;
  padding: 3px 10px;
}

/* ---------- 报头 ---------- */
.masthead {
  padding-top: 8px;
}
.masthead__kicker {
  margin: 0 0 10px;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}
.masthead__title {
  margin: 0;
  font-size: var(--text-4xl);
  line-height: var(--lh-tight);
  color: var(--text-primary);
}
.masthead__sub {
  margin: 14px 0 0;
  max-width: 52ch;
  font-size: var(--text-lg);
  color: var(--text-secondary);
}
.masthead__rule {
  display: block;
  margin-top: 22px;
  height: 2px;
  width: 64px;
  border-radius: 2px;
  background: var(--brand-gradient);
}

/* ---------- 头条封面 ---------- */
.cover__card {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(20px, 3vw, 40px);
  padding: clamp(18px, 2.4vw, 28px);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.cover__media {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4 / 3;
}
.cover__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-3) var(--ease-out);
}
.cover__card:hover .cover__media img {
  transform: scale(1.05);
}
.cover__media .cat-pill {
  position: absolute;
  left: 14px;
  bottom: 14px;
}
.cover__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cover__kicker {
  margin: 0 0 12px;
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--primary);
}
.cover__title {
  margin: 0;
  font-size: var(--text-3xl);
  line-height: var(--lh-tight);
  color: var(--text-primary);
}
.cover__excerpt {
  margin: 16px 0 0;
  font-size: var(--text-md);
  line-height: var(--lh-body);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cover__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.cover__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 700;
  font-size: var(--text-sm);
}
.cover__author {
  color: var(--text-secondary);
  font-weight: 600;
}
.cover__dot {
  color: var(--text-placeholder);
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.cover__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  align-self: flex-start;
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--primary);
  transition: gap var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out);
}
.cover__link:hover {
  gap: 10px;
  color: var(--primary-hover);
}

/* ---------- 文章流 ---------- */
.feed__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.feed__count {
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}
.filter-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-white);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--dur-1) var(--ease-out),
    background-color var(--dur-1) var(--ease-out),
    border-color var(--dur-1) var(--ease-out),
    transform var(--dur-1) var(--ease-out);
}
.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}
.filter-btn.is-active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
}
.feed__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--rail-gap);
}
.feed__empty {
  padding: 48px 0;
  text-align: center;
  font-size: var(--text-md);
  color: var(--text-muted);
}

/* ---------- 文章卡片 ---------- */
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--glass-border);
}
.card__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
}
.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-3) var(--ease-out);
}
.card:hover .card__media img {
  transform: scale(1.05);
}
.card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 16px 18px;
}
.card__title {
  margin: 0;
  font-size: var(--text-lg);
  line-height: var(--lh-tight);
  color: var(--text-primary);
  transition: color var(--dur-1) var(--ease-out);
}
.card:hover .card__title {
  color: var(--primary);
}
.card__excerpt {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--lh-body);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 2px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* ---------- 热门话题芯片 ---------- */
.topic-chip {
  white-space: nowrap;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  backdrop-filter: blur(var(--glass-blur)) saturate(150%);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--dur-1) var(--ease-out),
    transform var(--dur-1) var(--ease-out),
    border-color var(--dur-1) var(--ease-out);
}
.topic-chip:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

/* ---------- 响应式 ---------- */
@media (max-width: 860px) {
  .cover__card {
    grid-template-columns: 1fr;
  }
  .cover__media {
    aspect-ratio: 16 / 10;
  }
  .cover__title {
    font-size: var(--text-2xl);
  }
}
@media (min-width: 600px) {
  .feed__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .feed__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 480px) {
  .masthead__title {
    font-size: var(--text-3xl);
  }
  .filter-btn {
    padding: 7px 14px;
  }
}
</style>
