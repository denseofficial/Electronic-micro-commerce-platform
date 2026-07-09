import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 会员积分中心状态。
 * 积分仅在「任务真正完成」后发放：
 *   - 签到：点击即完成，直接发放；
 *   - 完善资料 / 评价订单 / 分享商品：跳转到对应业务面板，
 *     由该面板在动作成功后调用 award(key) 发放，避免"点了就去"的空奖励。
 * 状态持久化到 localStorage，跨页面导航与刷新不丢。
 */

const LS_KEY = 'ec_membership_v1'

const TASKS = [
  { key: 'signin', title: '每日签到', points: 10 },
  { key: 'profile', title: '完善个人资料', points: 50 },
  { key: 'review', title: '评价订单', points: 20 },
  { key: 'share', title: '分享商品', points: 15 },
]

const HISTORY_DEFAULT = [
  { date: '2026-07-08', reason: '每日签到', delta: 10 },
  { date: '2026-07-07', reason: '购买 iPhone 15', delta: 200 },
  { date: '2026-07-06', reason: '评价订单 #88231', delta: 20 },
  { date: '2026-07-05', reason: '兑换 50 元券', delta: -500 },
  { date: '2026-07-03', reason: '分享商品', delta: 15 },
  { date: '2026-07-01', reason: '完善个人资料', delta: 50 },
]

function todayStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const useMembershipStore = defineStore('membership', () => {
  const points = ref(1680)
  const history = ref(HISTORY_DEFAULT)
  const claimed = ref({})

  // 载入本地持久化数据（兼容旧版 claimed 数组格式）
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (typeof saved.points === 'number') points.value = saved.points
      if (Array.isArray(saved.history)) history.value = saved.history
      if (saved.claimed) {
        claimed.value = Array.isArray(saved.claimed)
          ? saved.claimed.reduce((m, k) => ({ ...m, [k]: true }), {})
          : saved.claimed
      }
    }
  } catch {
    /* 损坏的本地数据忽略 */
  }

  function persist() {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ points: points.value, history: history.value, claimed: claimed.value }),
      )
    } catch {
      /* 存储空间不足时静默 */
    }
  }

  // 完成任务后发放积分（每张任务仅发放一次）
  function award(key, reasonOverride) {
    if (claimed.value[key]) return
    const task = TASKS.find((t) => t.key === key)
    if (!task) return
    points.value += task.points
    history.value = [
      { date: todayStr(), reason: reasonOverride || task.title, delta: task.points },
      ...history.value,
    ]
    claimed.value = { ...claimed.value, [key]: true }
    persist()
  }

  // 签到即完成，直接发奖
  function signIn() {
    award('signin', '每日签到')
  }

  function isClaimed(key) {
    return !!claimed.value[key]
  }

  return { points, history, claimed, award, signIn, isClaimed }
})
