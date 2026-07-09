<script setup>
import { inject } from 'vue'

// ============ inject 获取站点配置 ============
const siteConfig = inject('siteConfig')
</script>

<template>
  <footer class="footer">
    <div class="footer__brand-strip" aria-hidden="true"></div>
    <div class="footer__inner">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </span>
          <div>
            <p class="footer__name">{{ siteConfig?.siteName }}</p>
            <p class="footer__slogan">好物优选 · 品质生活</p>
          </div>
        </div>

        <div class="footer__links">
          <div class="footer__col">
            <h4>购物指南</h4>
            <a href="#">购物流程</a>
            <a href="#">会员介绍</a>
            <a href="#">常见问题</a>
          </div>
          <div class="footer__col">
            <h4>配送方式</h4>
            <a href="#">上门自提</a>
            <a href="#">快递运输</a>
            <a href="#">物流跟踪</a>
          </div>
          <div class="footer__col">
            <h4>售后服务</h4>
            <a href="#">退换货政策</a>
            <a href="#">退款说明</a>
            <a href="#">联系客服</a>
          </div>
          <div class="footer__col">
            <h4>关于我们</h4>
            <a href="#">公司介绍</a>
            <a :href="'mailto:' + siteConfig?.contactEmail">联系我们</a>
            <a href="#">加入我们</a>
          </div>
          <div class="footer__col">
            <h4>探索</h4>
            <router-link to="/brand">品牌故事</router-link>
            <router-link to="/flash-sale">限时秒杀</router-link>
            <router-link to="/news">玩机资讯</router-link>
            <router-link to="/membership">会员中心</router-link>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p>{{ siteConfig?.copyright }}</p>
        <p class="footer__tip">本平台为学习演示项目，不提供真实交易</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink);
  color: var(--text-muted);
  margin-top: 56px;
  position: relative;
}

.footer__brand-strip {
  height: 4px;
  background: var(--brand-gradient);
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px 28px;
}

.footer__top {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--brand-gradient);
  color: #fff;
  box-shadow: var(--shadow-brand);
  flex-shrink: 0;
}
.footer__name {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 800;
  color: #fff;
}
.footer__slogan {
  margin: 2px 0 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.footer__links {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.footer__col h4 {
  color: #fff;
  font-size: var(--text-md);
  font-weight: 600;
  margin: 0 0 14px;
}

.footer__col a {
  display: block;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
  line-height: 2.2;
  transition: color var(--dur-1) var(--ease-out);
}
.footer__col a:hover {
  color: v-bind("siteConfig?.themeColor || '#ff4757'");
}

.footer__bottom {
  padding-top: 22px;
  text-align: center;
  font-size: 12px;
}
.footer__bottom p {
  margin: 4px 0;
}
.footer__tip {
  color: rgba(255, 255, 255, 0.32);
}

@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
@media (max-width: 600px) {
  .footer__links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
