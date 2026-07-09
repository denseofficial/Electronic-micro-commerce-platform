<script setup>
// 玩机资讯 / 攻略 — 编辑式杂志排版（破电商商品网格）
// 头条封面（非对称双栏）+ 可筛选文章流 + 热门话题横滑货架
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HorizontalRail from '../components/common/HorizontalRail.vue'
import { articles as NEWS } from '../mock/news'

// ============ 分类筛选 ============
const router = useRouter()
const categories = ['全部', '评测', '攻略', '资讯', '视频']
const activeCategory = ref('全部')

// ============ 模拟文章数据（共用 ../mock/news.js） ============
const articles = ref(NEWS)

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

function goArticle(a) {
  router.push({ name: 'NewsDetail', params: { id: a.id } })
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
          <a class="cover__link" href="#" @click.prevent="goArticle(featured)">
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
          class="card glass card--link"
          role="button"
          tabindex="0"
          v-reveal="{ delay: (i % 6) * 60 }"
          @click="goArticle(a)"
          @keyup.enter="goArticle(a)"
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
.card--link {
  cursor: pointer;
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
