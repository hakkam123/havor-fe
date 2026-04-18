<template>
  <div class="listing-toolbar">
    <div class="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
      <div class="relative">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          :value="searchTerm"
          type="text"
          :placeholder="placeholder || 'Search'"
          class="input-field py-2.5 pl-10 text-sm"
          @input="emit('update:searchTerm', $event.target.value)"
        >
      </div>

      <select
        :value="category"
        class="input-field py-2.5 text-sm"
        @change="emit('update:category', $event.target.value)"
      >
        <option value="">All Categories</option>
        <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
      </select>

      <select
        :value="sortBy"
        class="input-field py-2.5 text-sm"
        @change="emit('update:sortBy', $event.target.value)"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>

      <button type="button" class="btn-outline py-2.5" @click="emit('reset')">Reset</button>
    </div>

    <p class="mt-3 text-xs font-medium text-slate-500">
      Showing {{ resultCount }} result{{ resultCount === 1 ? '' : 's' }}
    </p>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'

defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    default: () => []
  },
  sortOptions: {
    type: Array,
    default: () => []
  },
  resultCount: {
    type: Number,
    default: 0
  },
  placeholder: {
    type: String,
    default: 'Search'
  }
})

const emit = defineEmits(['update:searchTerm', 'update:category', 'update:sortBy', 'reset'])
</script>
