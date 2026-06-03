<template>
  <div class="app-shell">
    <Transition name="app-loader">
      <div v-if="isPageLoading" class="app-loading-screen" aria-live="polite" aria-busy="true">
        <img src="/logo-havor.svg" alt="PT Havor Smarta Digital" class="app-loading-logo">
      </div>
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const route = useRoute()
const isPageLoading = ref(false)
const hasMounted = ref(false)
let loadingTimer = null

const showLoader = () => {
  isPageLoading.value = true

  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  loadingTimer = setTimeout(() => {
    isPageLoading.value = false
  }, 1200)
}

onMounted(() => {
  hasMounted.value = true
})

watch(() => route.fullPath, () => {
  if (!hasMounted.value) return
  showLoader()
})

onBeforeUnmount(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})
</script>

<style scoped>
.app-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 42%, rgba(31, 93, 204, 0.18), transparent 34%),
    linear-gradient(135deg, #031024 0%, #06152b 45%, #0e2d62 100%);
}

.app-shell {
  min-height: 100vh;
  background: #06152b;
}

.app-loading-logo {
  width: clamp(92px, 12vw, 148px);
  height: auto;
  animation: app-loader-pulse 1.2s ease-in-out infinite;
}

.app-loader-enter-active,
.app-loader-leave-active {
  transition: opacity 0.35s ease;
}

.app-loader-enter-from,
.app-loader-leave-to {
  opacity: 0;
}

@keyframes app-loader-pulse {
  0%,
  100% {
    opacity: 0.72;
    transform: scale(0.98);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
