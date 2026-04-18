<template>
  <div class="max-w-4xl mx-auto space-y-6" v-motion-fade-up>
    <div class="glass-panel p-6">
      <h1 class="text-2xl font-semibold text-slate-900 mb-6">Shared Categories</h1>
      
      <!-- Add Category -->
      <form class="flex gap-4 mb-8" @submit.prevent="handleAdd">
        <input v-model="newCategory" type="text" placeholder="New Category Name" class="input-field flex-1" required>
        <button type="submit" class="btn-primary px-6">Add</button>
      </form>

      <!-- Category List -->
      <div class="rounded-xl border border-slate-200 bg-slate-50">
        <div v-for="cat in categories" :key="cat.id" class="flex items-center justify-between p-4 border-b border-slate-200 last:border-0 hover:bg-white transition-colors">
          <div class="font-medium text-slate-800">{{ cat.name }}</div>
          <div class="flex gap-2 text-slate-400">
            <button class="hover:text-slate-700"><Edit2 class="w-4 h-4"/></button>
            <button @click="handleDelete(cat.id)" class="hover:text-rose-600"><Trash2 class="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Edit2, Trash2 } from 'lucide-vue-next'

const { categories, fetchCategories, createCategory, deleteCategory } = useCategories()
const newCategory = ref('')

onMounted(() => {
  fetchCategories()
})

const handleAdd = async () => {
  if (!newCategory.value) return
  await createCategory(newCategory.value)
  newCategory.value = ''
}

const handleDelete = async (id) => {
  if(confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(id)
  }
}
</script>
