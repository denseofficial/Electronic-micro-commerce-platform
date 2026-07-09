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
| 前端源文件 | 43 个 |
| `.vue` 组件 | 26 个 |
| `.js` 模块 | 17 个 |
| 后端源文件 | 16 个 |
| 页面视图 | 14 个 |
| Pinia Store | 3 个 |
| API 请求模块 | 5 个 |
| 通用组件 | 7 个 |
| 自定义指令 | 3 个 |

## 人员 C 页面逻辑层实现说明

### 模块一：`DataStats.vue`

功能简介：

数据统计页基于商品接口和分类接口生成统计看板，展示商品总数、累计销量、平均评分、平均价格、分类销量占比和热销商品 Top 5。页面支持分类切换和手动刷新，适合作为人员 C 的页面逻辑层核心模块。

对应知识点：

- `computed`：计算商品总数、累计销量、平均评分、平均价格、分类统计、热销 Top 5、当前分类汇总。
- `watch`：监听当前分类切换，配合 `immediate` 展示初始化监听逻辑。
- 生命周期：`onMounted` 页面加载时请求商品和分类数据，`onBeforeUnmount` 清理页面定时器。
- Element Plus：使用 `el-card`、`el-statistic`、`el-table`、`el-progress`、`el-tag` 组成统计业务页面。
- 网络数据渲染：通过 `frontend/src/api/products.js` 获取后端商品与分类数据。

对应实现：

- `frontend/src/views/DataStats.vue`：数据统计页面主体。
- `frontend/src/router/index.js`：新增 `/stats` 路由和 `DataStats` 命名路由。
- `frontend/src/components/common/AppHeader.vue`：顶部导航新增“数据统计”入口。
- `frontend/src/layouts/DefaultLayout.vue`：将 `DataStats` 加入 KeepAlive 缓存列表。

效果截图：

- 运行项目后访问 `http://localhost:5173/#/stats`，截图内容为“数据统计”页面，包含统计卡片、分类统计表格和热销商品 Top 5 表格。

### 模块二：`ProductList.vue`

功能简介：

商品列表页负责商品分类筛选、排序、分页与结果统计文案展示。用户切换分类、排序方式或页码时，页面会自动联动路由参数并重新请求数据。

对应知识点：

- `reactive`：统一管理 `categoryId`、`sort`、`page`、`pageSize` 筛选条件。
- `computed`：计算总页数、当前分类名称、当前排序名称、是否存在筛选条件、结果摘要。
- `watch`：监听路由 query 参数，同步筛选条件；深度监听 `filters`，使用 `deep` 和 `immediate` 自动加载数据。
- 业务逻辑：分类筛选、排序、分页、本地结果说明与滚动回顶部。

对应实现：

- `frontend/src/views/ProductList.vue`：商品筛选、排序、分页和结果摘要。

效果截图：

- 运行项目后访问 `http://localhost:5173/#/products`，截图内容为商品列表、分类筛选按钮、排序按钮、结果摘要和分页组件。

### 模块三：`Search.vue`

功能简介：

搜索结果页根据顶部搜索框传入的关键词展示商品结果，支持分页切换，并通过防抖减少重复请求。

对应知识点：

- `computed`：计算搜索标题、搜索结果摘要、总页数、是否存在关键词。
- `watch`：监听路由关键词 `q`，关键词变化后重置页码并触发搜索。
- 生命周期：`onBeforeUnmount` 清理搜索防抖定时器，避免页面离开后仍触发请求。
- 业务逻辑：搜索关键词联动、空结果提示、分页加载。

对应实现：

- `frontend/src/views/Search.vue`：搜索结果渲染、防抖请求和分页逻辑。

效果截图：

- 运行项目后在顶部搜索框输入关键词，跳转到 `http://localhost:5173/#/search?q=关键词`，截图内容为搜索结果列表、结果摘要、空状态或分页组件。

### 模块四：`Home.vue`

功能简介：

首页展示轮播图、分类入口、首页统计卡片和热销商品推荐。页面加载时请求商品和分类数据，并通过计算属性生成首页统计和热销商品列表。

对应知识点：

- `computed`：计算热销商品、新品数量、展示销量、分类数量和首页统计卡片数据。
- 生命周期：`onMounted` 首次加载首页数据，`onActivated` 和 `onDeactivated` 配合 KeepAlive 展示缓存生命周期。
- Element Plus：使用 `el-carousel`、`el-card`、`el-statistic`、`el-tag`、`el-button` 完成首页业务展示。

对应实现：

- `frontend/src/views/Home.vue`：首页业务数据派生、统计展示和热销商品渲染。

效果截图：

- 运行项目后访问 `http://localhost:5173/#/`，截图内容为首页轮播、统计卡片、商品分类和热销推荐区域。

## 人员 C 分工记录

| 姓名 | 负责的页面/功能模块 | 负责或主要贡献的知识点 |
|------|--------------------|------------------------|
| 人员 C | 首页、商品列表页、搜索结果页、数据统计页 | `computed` 计算属性、`watch` 侦听器、深度监听、立即监听、组合式 API 生命周期、页面加载请求数据、页面销毁清理定时器、筛选排序分页逻辑、Element Plus 业务组件使用 |

## 人员 C 开发过程中遇到的问题及解决方案

问题一：商品列表页的筛选条件较多，分类、排序、页码分散管理后容易出现状态不同步。

原因分析：

页面既要读取路由 query，又要根据用户点击更新筛选条件。如果多个 `ref` 分散维护，后续增加筛选项时容易漏同步，分页也可能停留在旧页码。

解决方案：

使用 `reactive` 将筛选条件集中到 `filters` 对象中，使用一个 `watch` 监听路由参数并同步到 `filters`，再用深度监听 `filters` 自动请求数据。这样筛选、排序、分页的触发路径统一，页面逻辑更清晰。

问题二：搜索页关键词变化较快时，可能产生重复请求。

原因分析：

搜索关键词来自路由参数，用户连续搜索或快速切换关键词时，直接在 `watch` 中请求接口会造成多次无效请求，影响页面体验。

解决方案：

在 `Search.vue` 中加入 300ms 防抖逻辑，关键词变化后先清除旧定时器，再延迟执行请求。同时在 `onBeforeUnmount` 中清理定时器，避免离开页面后继续执行异步逻辑。

问题三：统计页面需要从商品数据中派生多个指标，直接写在模板里会导致代码冗长。

原因分析：

总销量、平均评分、分类占比、Top 5 商品都属于派生数据。如果全部写在模板表达式中，会降低可读性，也不方便复用和调试。

解决方案：

将统计逻辑拆成多个 `computed`，包括 `totalSales`、`averageRating`、`categoryStats`、`topProducts`、`viewSummary` 等。模板只负责展示结果，业务计算集中在脚本区域。

## 人员 C 个人课程总结

通过本次电子微商城项目，我对 Vue 3 组合式 API 的页面逻辑组织方式有了更完整的理解。以前写页面时更关注“能显示出来”，这次在首页、商品列表、搜索页和数据统计页中，我把接口数据、筛选条件、派生统计和生命周期清理拆开处理，逐渐理解了 `computed` 适合处理派生数据，`watch` 适合响应外部变化，生命周期钩子适合处理页面加载和资源释放。

在业务页面开发中，我也体会到路由参数、组件状态和接口请求之间需要保持一致。商品列表页通过 `reactive filters` 和深度监听统一管理筛选条件后，代码比零散变量更容易维护。搜索页加入防抖和销毁清理后，我理解了前端页面除了渲染数据，还要考虑请求频率、页面切换和用户体验。

本次课程让我从单个知识点练习过渡到完整项目开发。后续如果继续完善该项目，我会优先补充更真实的数据统计图表、订单统计维度和接口异常状态展示，让页面逻辑更加接近实际电商后台或运营看板。

## License

MIT

---
