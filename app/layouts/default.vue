<template>
  <div class="admin-shell">
    <div class="flex min-h-screen gap-4 p-3 sm:p-4">
      <Sidebar />

      <div class="flex min-w-0 flex-1 flex-col">
        <div class="admin-panel flex min-h-0 flex-1 flex-col overflow-hidden">
          <Header />

          <main class="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4 pt-4 sm:px-5 lg:px-6 lg:pb-6 lg:pt-5">
            <div class="mx-auto w-full max-w-[1400px]">
              <slot />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
</script>
