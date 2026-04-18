<template>
  <div class="h-screen w-full bg-[#f7f8fb] flex overflow-hidden text-slate-900">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Header -->
      <Header />
      
      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-transparent px-5 pb-5 pt-4">
        <div class="w-full max-w-[1440px] mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'

// Assume we enforce an auth middleware generally
</script>
