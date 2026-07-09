<script setup>
// 纯 CSS 装饰性背景（无依赖）：流动的品牌色极光光斑
// 仅作氛围渲染；装饰性元素对辅助技术隐藏，且尊重减弱动效偏好。
defineProps({
  // 光斑数量（移动端可调小以降低密度）
  blobs: { type: Number, default: 3 },
})
</script>

<template>
  <div class="aurora" aria-hidden="true">
    <span
      v-for="n in blobs"
      :key="n"
      class="aurora__blob"
      :class="`aurora__blob--${n}`"
    ></span>
    <span class="aurora__grid"></span>
  </div>
</template>

<style scoped>
.aurora {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.aurora__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(46px);
  opacity: 0.55;
  will-change: transform;
}

.aurora__blob--1 {
  width: 46%;
  height: 120%;
  left: -6%;
  top: -20%;
  background: radial-gradient(circle at 30% 30%, #ff7a45, transparent 70%);
  animation: aurora-float-1 14s ease-in-out infinite;
}
.aurora__blob--2 {
  width: 42%;
  height: 110%;
  right: -8%;
  top: -10%;
  background: radial-gradient(circle at 60% 40%, #ff4757, transparent 70%);
  animation: aurora-float-2 18s ease-in-out infinite;
}
.aurora__blob--3 {
  width: 38%;
  height: 90%;
  left: 38%;
  bottom: -30%;
  background: radial-gradient(circle at 50% 50%, #7c4dff, transparent 70%);
  opacity: 0.4;
  animation: aurora-float-3 22s ease-in-out infinite;
}

.aurora__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 75%);
}

@keyframes aurora-float-1 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(8%, 6%, 0) scale(1.12); }
}
@keyframes aurora-float-2 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-6%, 8%, 0) scale(1.1); }
}
@keyframes aurora-float-3 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(4%, -8%, 0) scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .aurora__blob { animation: none !important; }
}
</style>
