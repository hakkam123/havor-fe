<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col glass-panel overflow-hidden" v-motion-fade-up>
    <!-- Header -->
    <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Inbox</h1>
        <p class="text-slate-500 text-sm">Customer contact messages and inquiries.</p>
      </div>
      <div class="flex gap-2">
        <button class="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"><Filter class="w-4 h-4"/></button>
        <button @click="refreshMessages" class="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"><RefreshCw class="w-4 h-4"/></button>
      </div>
    </div>

    <!-- Messages Layout -->
    <div class="flex-1 flex overflow-hidden">
      <!-- List -->
      <div class="w-1/3 border-r border-slate-200 overflow-y-auto custom-scrollbar bg-slate-50">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          @click="selectedMessage = msg"
          class="p-4 border-b border-slate-200 cursor-pointer transition-colors relative"
          :class="selectedMessage?.id === msg.id ? 'bg-white border-l-2 border-l-slate-900' : 'hover:bg-white border-l-2 border-l-transparent'"
        >
          <div class="flex justify-between items-start mb-1">
            <h4 class="font-medium text-slate-900 truncate pr-4" :class="!msg.is_read ? 'font-semibold' : ''">{{ msg.name }}</h4>
            <span class="text-[10px] text-slate-500 whitespace-nowrap">{{ msg.dateLabel || '-' }}</span>
          </div>
          <p class="text-sm text-slate-600 truncate mb-1">{{ msg.subject }}</p>
          <p class="text-xs text-slate-500 line-clamp-1">{{ msg.summary }}</p>
          <div v-if="!msg.is_read" class="absolute top-4 right-4 w-2 h-2 bg-slate-900 rounded-full"></div>
        </div>
      </div>

      <!-- Detail -->
      <div class="flex-1 flex flex-col bg-white">
        <div v-if="selectedMessage" class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div class="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
            <div>
              <h2 class="text-2xl font-semibold text-slate-900 mb-2">{{ selectedMessage.subject }}</h2>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-medium">
                  {{ selectedMessage.name.charAt(0) }}
                </div>
                <div>
                  <p class="text-slate-900 text-sm font-medium">{{ selectedMessage.name }}</p>
                  <p class="text-slate-400 text-xs">{{ selectedMessage.email }}</p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                v-if="!selectedMessage.is_read" 
                @click="handleMarkAsRead(selectedMessage)"
                class="btn-primary text-xs py-1.5 px-3 flex items-center gap-2"
              >
                <Check class="w-3 h-3" /> Mark as Read
              </button>
              <button @click="handleDelete(selectedMessage.id)" class="p-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors"><Trash2 class="w-4 h-4"/></button>
            </div>
          </div>
          <div class="max-w-none">
            <p class="text-slate-600 leading-relaxed whitespace-pre-wrap">{{ selectedMessage.body }}</p>
          </div>
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-500">
          <Mail class="w-16 h-16 mb-4 opacity-50" />
          <p>Select a message to read</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Filter, RefreshCw, Trash2, Check, Mail } from 'lucide-vue-next'

const { messages, fetchMessages, markAsRead, deleteMessage } = useContact()
const selectedMessage = ref(null)

const syncSelectedMessage = (preferredId = selectedMessage.value?.id) => {
  if (!messages.value.length) {
    selectedMessage.value = null
    return
  }

  selectedMessage.value = messages.value.find((msg) => msg.id === preferredId) || messages.value[0]
}

const refreshMessages = async () => {
  await fetchMessages()
  syncSelectedMessage()
}

const handleMarkAsRead = async (msg) => {
  await markAsRead(msg.id)
  syncSelectedMessage(msg.id)
}

const handleDelete = async (id) => {
  await deleteMessage(id)
  syncSelectedMessage()
}

onMounted(() => {
  refreshMessages()
})
</script>
