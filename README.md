# 电子微商城

基于 **Vue 3 + Vite + Express** 构建的全栈电子微商城平台，覆盖商品浏览、搜索筛选、购物车、下单支付、地址管理等完整电商核心流程。

## 技术栈

### 前端

| 技术 | 说明 |
|------|------|
| **Vue 3** (Composition API + `<script setup>`) | 渐进式前端框架 |
| **Vite** | 下一代前端构建工具 |
| **Vue Router 5** | 路由管理（Hash 模式） |
| **Pinia 3** | 轻量级状态管理 |
| **Element Plus** | UI 组件库（中文语言包） |
| **Axios** | HTTP 网络请求 |

### 后端

| 技术 | 说明 |
|------|------|
| **Express 4** | Node.js Web 框架 |
| **JWT** (jsonwebtoken) | 用户认证鉴权 |
| **bcryptjs** | 密码加密 |
| **JSON 文件数据库** | 轻量级数据持久化 |
| **multer** | 文件上传 |

## 项目结构

```
Electronic micro-commerce platform/
├── frontend/                     # 前端 Vue3 SPA
│   ├── index.html                # 入口 HTML
│   ├── vite.config.js            # Vite 配置（含 API 代理）
│   ├── package.json
│   └── src/
│       ├── main.js               # 应用入口
│       ├── App.vue               # 根组件（provide 站点配置）
│       ├── style.css             # 全局样式（CSS 变量设计系统）
│       ├── api/                  # API 请求模块（5 个文件）
│       │   ├── auth.js           # 登录/注册/用户信息
│       │   ├── products.js       # 商品列表/详情/分类
│       │   ├── cart.js           # 购物车 CRUD（localStorage）
│       │   ├── orders.js         # 订单创建/查询/支付/取消
│       │   └── user.js           # 个人信息/地址管理
│       ├── assets/               # 静态资源
│       ├── components/           # 可复用组件
│       │   └── common/           # 通用组件（7 个）
│       │       ├── AppHeader.vue     # 顶部导航（Logo/搜索/购物车/用户）
│       │       ├── AppFooter.vue     # 页脚导航
│       │       ├── ProductCard.vue   # 商品卡片（插槽支持自定义）
│       │       ├── SearchBar.vue     # 搜索栏（v-model + emit）
│       │       ├── StarRating.vue    # 星级评分
│       │       ├── Pagination.vue    # 分页器
│       │       └── CartBadge.vue     # 购物车角标
│       ├── composables/          # 组合式函数（预留）
│       ├── layouts/
│       │   └── DefaultLayout.vue # 默认布局（Header + RouterView + Footer）
│       ├── mock/                 # Mock 数据（开发阶段）
│       ├── router/
│       │   └── index.js          # 路由配置 + beforeEach 导航守卫
│       ├── stores/               # Pinia 状态管理
│       │   ├── auth.js           # 用户认证（token/user/登录态）
│       │   ├── cart.js           # 购物车（增删改查/全选/合计）
│       │   └── product.js        # 商品（列表/详情/分类/筛选）
│       ├── utils/
│       │   ├── request.js        # Axios 实例（拦截器封装）
│       │   ├── token.js          # Token 工具
│       │   ├── format.js         # 格式化工具
│       │   ├── validate.js       # 校验工具
│       │   └── directives.js     # 全局自定义指令
│       └── views/                # 页面视图（13 个页面）
│           ├── Home.vue              # 首页（Banner轮播/分类/热销）
│           ├── ProductList.vue       # 商品列表（分类筛选/排序/分页）
│           ├── ProductDetail.vue     # 商品详情（规格/评分/加购）
│           ├── Search.vue            # 搜索页面
│           ├── Cart.vue              # 购物车（勾选/数量/合计）
│           ├── Checkout.vue          # 结算页（地址/商品/下单）
│           ├── OrderConfirm.vue      # 订单确认（支付/取消）
│           ├── OrderList.vue         # 订单列表（Tab 切换状态）
│           ├── OrderDetail.vue       # 订单详情
│           ├── Login.vue             # 登录
│           ├── Register.vue          # 注册
│           ├── UserCenter.vue        # 个人中心（动态组件 + KeepAlive）
│           ├── NotFound.vue          # 404 页面
│           └── tabs/                 # 个人中心 Tab 面板
│               ├── ProfilePanel.vue  # 个人信息
│               ├── AddressPanel.vue  # 地址管理
│               └── SettingsPanel.vue # 站点设置
├── backend/                      # 后端 Express API 服务
│   ├── server.js                 # 启动入口
│   ├── .env                      # 环境变量
│   ├── package.json
│   └── src/
│       ├── app.js                # Express 应用（CORS/JSON/静态文件）
│       ├── config/index.js       # 环境配置
│       ├── database/index.js     # JSON 文件数据库初始化
│       ├── middleware/
│       │   ├── auth.js           # JWT 认证中间件
│       │   └── errorHandler.js   # 错误处理中间件
│       ├── controllers/
│       │   ├── authController.js      # 认证控制器
│       │   ├── productController.js   # 商品控制器
│       │   ├── orderController.js     # 订单控制器
│       │   └── userController.js      # 用户控制器
│       └── routes/
│           ├── index.js          # 路由汇总
│           ├── auth.js           # /api/auth/*
│           ├── products.js       # /api/products/*
│           ├── orders.js         # /api/orders/*
│           └── users.js          # /api/users/*
└── 电子微商城Vue项目要点实现情况总结.txt  # 知识点实现详情
```

## 功能特性

### 核心电商流程

- **商品浏览** — 首页轮播 Banner、分类网格入口、热销商品展示
- **搜索筛选** — 关键词搜索、分类筛选、排序切换、分页浏览
- **商品详情** — 图片切换、规格参数、星级评分、数量选择
- **购物车** — 加入购物车、勾选结算、数量调整、全选/删除
- **下单结算** — 选择收货地址、确认订单、提交结算
- **订单管理** — 订单列表（Tab 按状态切换）、订单详情、支付/取消
- **地址管理** — 新增/编辑/删除收货地址、设为默认

### 用户系统

- **注册/登录** — 表单校验、JWT Token 认证
- **路由守卫** — `beforeEach` 全局前置守卫，未登录自动跳转
- **个人中心** — 个人信息编辑、头像上传

### 技术亮点

- **全部组件使用 `<script setup>` 语法糖** + `scoped` 样式隔离
- **Pinia 模块化状态管理** — 3 个独立 Store（auth/cart/product），关键状态 localStorage 持久化
- **Axios 拦截器封装** — 自动注入 Token、统一错误处理、401 自动跳转登录
- **3 个自定义全局指令** — `v-focus`（自动聚焦）、`v-lazy`（图片懒加载）、`v-permission`（权限控制）
- **组件插槽** — `ProductCard` 支持默认插槽、`#tags` 和 `#footer` 具名插槽
- **provide/inject 跨级通信** — 站点配置从 `App.vue` 注入到深层子孙组件
- **KeepAlive 组件缓存** — 首页/商品列表/搜索结果页缓存，避免重复渲染
- **动态组件 + Tab 切换** — 个人中心 `<component :is>` 切换面板
- **Element Plus 集成** — 轮播/表单/对话框/消息提示/确认弹窗
- **CSS 变量设计系统** — 统一的主题色（红色 #ff4757）、圆角、阴影、动画
- **响应式布局** — 适配 768px / 1024px / 640px 断点
- **页面进场动画** — `@keyframes fadeIn` 全局过渡效果

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 1. 克隆项目

```bash
git clone <repo-url>
cd "Electronic micro-commerce platform"
```

### 2. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端服务运行在 `http://localhost:3000`，首次启动将自动初始化种子数据（商品、分类、测试用户等）。

### 3. 启动前端开发服务器

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器运行在 `http://localhost:5173`，Vite 自动将 `/api` 请求代理到后端 3000 端口。

### 4. 测试账号

> 种子数据中包含的测试账号（具体见 `backend/src/database/index.js`）

### 5. 构建生产包

```bash
cd frontend
npm run build     # 输出到 dist/ 目录
npm run preview   # 预览构建结果
```

## API 接口

### 认证相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 否 |
| POST | `/api/auth/login` | 用户登录 | 否 |
| GET | `/api/auth/me` | 获取当前用户信息 | 是 |

### 商品相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/products` | 商品列表（支持 category/sort/page/pageSize/keyword） | 否 |
| GET | `/api/products/:id` | 商品详情 | 否 |
| GET | `/api/categories` | 商品分类 | 否 |

### 订单相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/orders` | 创建订单 | 是 |
| GET | `/api/orders` | 订单列表（支持 status 筛选） | 是 |
| GET | `/api/orders/:id` | 订单详情 | 是 |
| POST | `/api/orders/:id/pay` | 支付订单 | 是 |
| POST | `/api/orders/:id/cancel` | 取消订单 | 是 |

### 用户相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| PUT | `/api/users/profile` | 更新个人信息 | 是 |
| GET | `/api/users/addresses` | 获取地址列表 | 是 |
| POST | `/api/users/addresses` | 新增地址 | 是 |
| PUT | `/api/users/addresses/:id` | 更新地址 | 是 |
| DELETE | `/api/users/addresses/:id` | 删除地址 | 是 |

### 通用

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/health` | 健康检查 | 否 |

## 页面路由

| 路径 | 名称 | 页面 | 登录要求 |
|------|------|------|----------|
| `/` | Home | 首页 | 否 |
| `/products` | ProductList | 商品列表 | 否 |
| `/product/:id` | ProductDetail | 商品详情 | 否 |
| `/search` | Search | 搜索页 | 否 |
| `/cart` | Cart | 购物车 | 否 |
| `/checkout` | Checkout | 结算页 | **是** |
| `/order-confirm/:id` | OrderConfirm | 订单确认 | **是** |
| `/orders` | OrderList | 订单列表 | **是** |
| `/order/:id` | OrderDetail | 订单详情 | **是** |
| `/user` | UserCenter | 个人中心 | **是** |
| `/login` | Login | 登录 | 否 |
| `/register` | Register | 注册 | 否 |
| `/*` | NotFound | 404 | 否 |

## 项目统计

| 类别 | 数量 |
|------|------|
| 前端源文件 | 42 个 |
| `.vue` 组件 | 25 个 |
| `.js` 模块 | 17 个 |
| 后端源文件 | 16 个 |
| 页面视图 | 13 个 |
| Pinia Store | 3 个 |
| API 请求模块 | 5 个 |
| 通用组件 | 7 个 |
| 自定义指令 | 3 个 |

## License

MIT

---
