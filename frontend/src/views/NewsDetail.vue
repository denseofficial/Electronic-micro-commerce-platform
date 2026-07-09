<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleById, articles } from '../mock/news'

const route = useRoute()
const router = useRouter()

const article = computed(() => getArticleById(route.params.id))
const related = computed(() =>
  article.value
    ? articles.filter((a) => a.id !== article.value.id && a.category === article.value.category).slice(0, 3)
    : [],
)

function back() {
  router.push({ name: 'News' })
}
function goArticle(a) {
  router.push({ name: 'NewsDetail', params: { id: a.id } })
}
function initials(name) {
  return name ? name.trim().charAt(0) : '·'
}
</script>

<template>
  <div class="article">
    <button class="back" type="button" @click="back">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      返回玩机志
    </button>

    <template v-if="article">
      <header class="head" v-reveal>
        <span class="cat-pill cat-pill--accent">{{ article.category }}</span>
        <h1 class="head__title font-display">{{ article.title }}</h1>
        <div class="head__meta">
          <span class="head__avatar" aria-hidden="true">{{ initials(article.author) }}</span>
          <span class="head__author">{{ article.author }}</span>
          <span class="head__dot" aria-hidden="true">·</span>
          <span class="meta-item">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
              <path d="M3 9h18M8 3v3M16 3v3" />
            </svg>
            {{ article.date }}
          </span>
          <span class="meta-item">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {{ article.readTime }} 分钟阅读
          </span>
        </div>
      </header>

      <div class="hero" v-reveal>
        <img :src="`/images/${article.image}.jpg`" :alt="article.title" />
      </div>

      <article class="body" v-reveal>
        <p class="body__lead">{{ article.excerpt }}</p>
        <p>
          这是一篇来自《玩机志》的{{ article.category }}内容。我们把两周的真实使用、实测数据与一手上手体验整理成这篇长文，希望在你做购买决策、或单纯围观时都能有一点帮助。
        </p>
        <p>
          从开箱的第一印象，到日常使用中最容易被忽略的细节，再到和同价位对手的横向对比，我们尽量把结论讲清楚、把取舍说明白——不堆参数，只聊真实体验。
        </p>
        <blockquote class="body__quote">「认真玩机的人，值得一篇认真写出来的评测。」</blockquote>
        <p>
          如果你对这款产品还有疑问，或者想看我们补充某个维度的测试，欢迎在评论区告诉我们。下一期选题，由你们决定。
        </p>
      </article>

      <section v-if="related.length" class="related" v-reveal>
        <h2 class="related__title font-display">相关阅读</h2>
        <div class="related__list">
          <button
            v-for="a in related"
            :key="a.id"
            class="related__item glass"
            type="button"
            @click="goArticle(a)"
          >
            <img class="related__img" :src="`/images/${a.image}.jpg`" :alt="a.title" />
            <span class="related__cat cat-pill cat-pill--sm">{{ a.category }}</span>
            <span class="related__name">{{ a.title }}</span>
          </button>
        </div>
      </section>
    </template>

    <div v-else class="missing">
      <div class="state__text">没有找到这篇资讯</div>
      <button class="btn btn--primary" type="button" @click="back">返回列表</button>
    </div>
  </div>
</template>

<style scoped>
.article {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
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

.back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-white);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--dur-1) var(--ease-out), border-color var(--dur-1) var(--ease-out);
}
.back:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.head {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.head__title {
  margin: 0;
  font-size: var(--text-4xl);
  line-height: var(--lh-tight);
  color: var(--text-primary);
}
.head__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.head__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 700;
}
.head__author {
  color: var(--text-secondary);
  font-weight: 600;
}
.head__dot {
  color: var(--text-placeholder);
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.hero {
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 16 / 9;
}
.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: var(--text-lg);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}
.body__lead {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.5;
}
.body__quote {
  margin: 0;
  padding: 14px 18px;
  border-left: 3px solid var(--primary);
  background: var(--primary-bg);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
}

.related__title {
  margin: 0 0 14px;
  font-size: var(--text-2xl);
  color: var(--text-primary);
}
.related__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}
.related__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: left;
  border: 1px solid transparent;
  transition: transform var(--dur-2) var(--ease-out), border-color var(--dur-2) var(--ease-out);
}
.related__item:hover {
  transform: translateY(-3px);
  border-color: var(--glass-border);
}
.related__img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: var(--radius-md);
}
.related__cat {
  align-self: flex-start;
}
.related__name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.missing {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
}
.state__text {
  font-size: var(--text-lg);
  color: var(--text-secondary);
}

/* 通用图标 / 分类药丸 */
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
  color: var(--text-secondary);
}
.cat-pill--accent {
  color: var(--accent);
}
.cat-pill--sm {
  font-size: 11px;
  padding: 3px 10px;
}

@media (max-width: 768px) {
  .head__title {
    font-size: var(--text-3xl);
  }
}
</style>
