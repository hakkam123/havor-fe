<template>
  <div class="max-w-2xl mx-auto space-y-6" v-motion-fade-up>
    <div class="glass-panel p-8">
      <h1 class="text-2xl font-semibold text-slate-900 mb-2">Admin Profile</h1>
      <p class="text-sm text-slate-500 mb-8">Update your account credentials</p>
      
      <form class="space-y-6" @submit.prevent>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Username</label>
          <input type="text" class="input-field" value="admin_havor">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
          <input type="email" class="input-field" value="admin@havorsmarta.com">
        </div>
        
        <hr class="border-slate-200 my-6">
        <h3 class="text-lg font-medium text-slate-900 mb-4">Change Password</h3>
        
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
          <input type="password" class="input-field" placeholder="********">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">New Password</label>
          <input type="password" class="input-field" placeholder="********">
        </div>
        
        <div class="pt-4 flex justify-end">
          <button type="submit" class="btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>
