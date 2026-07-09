import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('../views/ProductList.vue'),
        meta: { title: '商品列表' },
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('../views/ProductDetail.vue'),
        meta: { title: '商品详情' },
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('../views/Search.vue'),
        meta: { title: '搜索' },
      },
      {
        path: 'stats',
        name: 'DataStats',
        component: () => import('../views/DataStats.vue'),
        meta: { title: '数据统计' },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../views/Cart.vue'),
        meta: { title: '购物车' },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('../views/Checkout.vue'),
        meta: { title: '结算', auth: true },
      },
      {
        path: 'order-confirm/:id',
        name: 'OrderConfirm',
        component: () => import('../views/OrderConfirm.vue'),
        meta: { title: '订单确认', auth: true },
      },
      {
        path: 'orders',
        name: 'OrderList',
        component: () => import('../views/OrderList.vue'),
        meta: { title: '我的订单', auth: true },
      },
      {
        path: 'order/:id',
        name: 'OrderDetail',
        component: () => import('../views/OrderDetail.vue'),
        meta: { title: '订单详情', auth: true },
      },
      {
        path: 'user',
        name: 'UserCenter',
        component: () => import('../views/UserCenter.vue'),
        meta: { title: '个人中心', auth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 导航守卫：设置页面标题 + 登录鉴权
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 电子微商城` : '电子微商城'

  if (to.meta.auth) {
    const token = localStorage.getItem('ec_mall_token')
    if (!token) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  }
  next()
})

export default router
