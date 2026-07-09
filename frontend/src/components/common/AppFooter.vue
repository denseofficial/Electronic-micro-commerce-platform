<script setup>
import { inject } from 'vue'

// ============ inject 获取站点配置 ============
const siteConfig = inject('siteConfig')
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
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
      </div>
      <div class="footer__bottom">
        <!-- 来自 provide/inject 的版权信息 -->
        <p>{{ siteConfig?.copyright }}</p>
        <p>本平台为学习演示项目，不提供真实交易</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2c3e50;
  color: #bdc3c7;
  margin-top: 40px;
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px 20px;
}

.footer__links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.footer__col h4 {
  color: #ecf0f1;
  font-size: 16px;
  margin: 0 0 12px;
}

.footer__col a {
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  font-size: 13px;
  line-height: 2;
  transition: color 0.2s;
}

.footer__col a:hover {
  color: v-bind("siteConfig?.themeColor || '#ff4757'");
}

.footer__bottom {
  border-top: 1px solid #3d5266;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
}

.footer__bottom p {
  margin: 4px 0;
}

@media (max-width: 768px) {
  .footer__links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
