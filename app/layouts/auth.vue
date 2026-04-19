<template>
  <div class="admin-shell flex min-h-screen items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_30%),linear-gradient(135deg,#f9fafc_0%,#f2f4f8_100%)]"></div>
    <div class="relative z-10 w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
