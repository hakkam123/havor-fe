<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Account</p>
          <h1 class="admin-title">Admin Profile</h1>
          <p class="admin-copy">Update account information, security credentials, and workspace preferences for the admin team.</p>
        </div>

        <button type="submit" form="profile-form" class="admin-primary-btn">Save Changes</button>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section class="admin-panel p-6">
        <div class="flex flex-col items-center text-center">
          <div class="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[var(--admin-accent)] text-2xl font-semibold text-white">AU</div>
          <h2 class="mt-4 text-xl font-semibold text-slate-900">Admin User</h2>
          <p class="mt-1 text-sm text-slate-500">Superadmin</p>
          <div class="mt-6 grid w-full gap-3 text-left">
            <div class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-4 py-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
              <p class="mt-1 text-sm font-semibold text-slate-700">Havor CMS</p>
            </div>
            <div class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-4 py-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Last Update</p>
              <p class="mt-1 text-sm font-semibold text-slate-700">Today</p>
            </div>
          </div>
        </div>
      </section>

      <section class="admin-panel p-6">
        <form id="profile-form" class="space-y-8" @submit.prevent>
          <div>
            <p class="admin-kicker">Credentials</p>
            <h2 class="mt-2 text-xl font-semibold text-slate-900">Profile Details</h2>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Username</label>
              <input type="text" class="admin-input" value="admin_havor">
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Email Address</label>
              <input type="email" class="admin-input" value="admin@havorsmarta.com">
            </div>
          </div>

          <div class="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">Change Password</p>
                <p class="mt-1 text-sm text-slate-500">Keep your admin access secure with a stronger password.</p>
              </div>
            </div>

            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Current Password</label>
                <input type="password" class="admin-input" placeholder="********">
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">New Password</label>
                <input type="password" class="admin-input" placeholder="********">
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="admin-primary-btn">Save Changes</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
