/**
 * 玩机资讯模拟数据（列表页 News.vue 与详情页 NewsDetail.vue 共享）
 */
export const articles = [
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
]

export function getArticleById(id) {
  const n = Number(id)
  return articles.find((a) => a.id === n) || null
}
