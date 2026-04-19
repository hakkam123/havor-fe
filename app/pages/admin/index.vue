<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Product Control</p>
          <h1 class="admin-title">Product</h1>
          <p class="admin-copy">
            Monitor product performance, publishing flow, and team activity from one cleaner operations view.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button class="admin-secondary-btn">
            <SlidersHorizontal class="h-4 w-4" />
            Customize
          </button>
          <button class="admin-secondary-btn">
            <Download class="h-4 w-4" />
            Export
          </button>
          <button class="admin-primary-btn">
            <Plus class="h-4 w-4" />
            Add New Product
          </button>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <button class="admin-secondary-btn py-2 text-xs">
            <LayoutGrid class="h-4 w-4" />
            Table View
          </button>
          <button class="admin-secondary-btn py-2 text-xs">
            <Filter class="h-4 w-4" />
            Filter
          </button>
          <button class="admin-secondary-btn py-2 text-xs">
            <ArrowDownUp class="h-4 w-4" />
            Sort
          </button>
        </div>

        <label class="inline-flex items-center gap-3 rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-4 py-2 text-sm font-medium text-slate-600">
          Show statistics
          <button
            type="button"
            class="relative h-6 w-11 rounded-full transition"
            :class="showStats ? 'bg-orange-400' : 'bg-slate-300'"
            @click="showStats = !showStats"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition"
              :class="showStats ? 'left-[1.35rem]' : 'left-0.5'"
            ></span>
          </button>
        </label>
      </div>

      <div v-if="showStats" class="admin-stat-grid mt-6">
        <article v-for="stat in stats" :key="stat.label" class="admin-stat-card">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="admin-stat-label">{{ stat.label }}</p>
              <div class="admin-stat-value">{{ stat.value }}</div>
              <p class="admin-stat-meta">
                <span class="font-semibold text-emerald-600">{{ stat.delta }}</span>
                {{ stat.meta }}
              </p>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl" :class="stat.iconWrapClass">
              <component :is="stat.icon" class="h-5 w-5" :class="stat.iconClass" />
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_360px]">
      <div class="admin-table-shell">
        <div class="admin-toolbar">
          <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div class="relative min-w-0 xl:w-[280px]">
              <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products"
                class="admin-input pl-11"
              >
            </div>
            <button class="admin-secondary-btn py-2 text-xs">Show all status</button>
          </div>

          <div class="flex items-center gap-2">
            <button class="admin-secondary-btn py-2 text-xs">Apply Code</button>
            <button class="admin-secondary-btn py-2 text-xs">Edit info</button>
            <button class="admin-secondary-btn py-2 text-xs">Delete</button>
          </div>
        </div>

        <div class="custom-scrollbar overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in approvalRows" :key="row.name">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white" :class="row.avatarClass">
                      {{ row.initials }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">{{ row.name }}</p>
                      <p class="text-xs text-slate-400">{{ row.owner }}</p>
                    </div>
                  </div>
                </td>
                <td class="font-medium text-slate-700">{{ row.price }}</td>
                <td>{{ row.sales }}</td>
                <td class="font-medium text-slate-700">{{ row.revenue }}</td>
                <td>{{ row.stock }}</td>
                <td>
                  <span class="admin-status" :class="row.statusClass">{{ row.status }}</span>
                </td>
                <td>
                  <div class="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <Star class="h-4 w-4 fill-amber-400 text-amber-400" />
                    {{ row.rating }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-3 border-t border-[var(--admin-border)] px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing per page 10</p>
          <div class="flex items-center gap-2">
            <button class="admin-icon-btn h-9 w-9 rounded-xl">
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-accent)] text-sm font-semibold text-white">1</button>
            <button class="admin-icon-btn h-9 w-9 rounded-xl">2</button>
            <button class="admin-icon-btn h-9 w-9 rounded-xl">3</button>
            <button class="admin-icon-btn h-9 w-9 rounded-xl">
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <section class="admin-panel p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">Channel Mix</p>
              <p class="mt-1 text-xs text-[var(--admin-muted)]">Distribution by product source</p>
            </div>
            <button class="admin-icon-btn h-9 w-9 rounded-xl">
              <MoreHorizontal class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 space-y-4">
            <div v-for="type in contentTypes" :key="type.label">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-medium text-slate-700">{{ type.label }}</span>
                <span class="font-semibold text-slate-500">{{ type.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100">
                <div class="h-2 rounded-full" :class="type.barClass" :style="{ width: `${type.width}%` }"></div>
              </div>
            </div>
          </div>
        </section>

        <section class="admin-panel p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">Recent Activity</p>
              <p class="mt-1 text-xs text-[var(--admin-muted)]">Live updates from your editors</p>
            </div>
            <button class="text-sm font-semibold text-slate-600">View all</button>
          </div>

          <div class="mt-5 space-y-4">
            <article v-for="activity in activities" :key="activity.title" class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl" :class="activity.iconWrapClass">
                  <component :is="activity.icon" class="h-5 w-5" :class="activity.iconClass" />
                </div>
                <div>
                  <p class="font-semibold text-slate-900">{{ activity.title }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-500">{{ activity.description }}</p>
                  <p class="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{{ activity.time }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Activity,
  ArrowDownUp,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  Inbox,
  LayoutGrid,
  MoreHorizontal,
  Newspaper,
  PackageSearch,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star
} from 'lucide-vue-next'

const showStats = ref(true)

const stats = [
  { label: 'Total Product', value: '250', delta: '+3', meta: 'product', icon: PackageSearch, iconWrapClass: 'bg-orange-50', iconClass: 'text-orange-500' },
  { label: 'Product Revenue', value: '$15,490', delta: '+9%', meta: 'vs last month', icon: ShieldCheck, iconWrapClass: 'bg-emerald-50', iconClass: 'text-emerald-500' },
  { label: 'Product Sold', value: '2,355', delta: '+7%', meta: 'vs last month', icon: Inbox, iconWrapClass: 'bg-blue-50', iconClass: 'text-blue-500' },
  { label: 'Avg. Monthly Sales', value: '890', delta: '+5%', meta: 'vs last month', icon: Activity, iconWrapClass: 'bg-violet-50', iconClass: 'text-violet-500' }
]

const contentTypes = [
  { label: 'Direct store', total: 52, width: 78, barClass: 'bg-[var(--admin-accent)]' },
  { label: 'Marketplace', total: 31, width: 58, barClass: 'bg-[#6b90c6]' },
  { label: 'Reseller', total: 20, width: 40, barClass: 'bg-[#8eabd4]' },
  { label: 'Custom order', total: 12, width: 24, barClass: 'bg-[#c7d7ec]' }
]

const approvalRows = [
  { name: 'HavorFlow T-Shirt #10 White', initials: 'HW', owner: 'Lifestyle', avatarClass: 'bg-[var(--admin-accent)]', price: '$135', sales: '471 pcs', revenue: '$635.85', stock: '100', status: 'In Stock', statusClass: 'admin-status-success', rating: '5.0' },
  { name: 'HavorFlow T-Shirt #10 Black', initials: 'HB', owner: 'Lifestyle', avatarClass: 'bg-[#6288c0]', price: '$135', sales: '402 pcs', revenue: '$544.05', stock: '0', status: 'Out of Stock', statusClass: 'admin-status-danger', rating: '5.0' },
  { name: 'HavorFlow T-Shirt #9 White', initials: 'H9', owner: 'Lifestyle', avatarClass: 'bg-[#7899c9]', price: '$135', sales: '455 pcs', revenue: '$645.25', stock: '20', status: 'Restock', statusClass: 'admin-status-warning', rating: '4.9' },
  { name: 'SmartHome Hub', initials: 'SH', owner: 'Automation', avatarClass: 'bg-[#8cadD5]', price: '$150', sales: '7 pcs', revenue: '$1,050.00', stock: '12', status: 'In Stock', statusClass: 'admin-status-info', rating: '4.8' },
  { name: 'UltraSound Wireless Earbuds', initials: 'UE', owner: 'Audio', avatarClass: 'bg-[#9bb7dc]', price: '$200', sales: '5 pcs', revenue: '$1,000.00', stock: '0', status: 'Out of Stock', statusClass: 'admin-status-danger', rating: '4.8' },
  { name: 'HavorFlow Rose View Shirt', initials: 'RV', owner: 'Lifestyle', avatarClass: 'bg-[#b7cae5]', price: '$135', sales: '120 pcs', revenue: '$162.40', stock: '20', status: 'In Stock', statusClass: 'admin-status-success', rating: '4.7' }
]

const activities = [
  { title: 'Product library expanded', description: 'Three new product entries were added with category mapping and external links.', time: '10 min ago', icon: PackageSearch, iconWrapClass: 'bg-blue-50', iconClass: 'text-blue-500' },
  { title: 'Portfolio pipeline refreshed', description: 'Works collection is waiting on final imagery before the approval queue is cleared.', time: '2 hr ago', icon: Briefcase, iconWrapClass: 'bg-orange-50', iconClass: 'text-orange-500' },
  { title: 'Editorial calendar updated', description: 'The news team published one article and scheduled two more drafts for review.', time: 'Yesterday', icon: Newspaper, iconWrapClass: 'bg-emerald-50', iconClass: 'text-emerald-500' },
  { title: 'Approval queue adjusted', description: 'Pending review items moved into a faster moderation lane for launch week.', time: 'Yesterday', icon: Clock3, iconWrapClass: 'bg-slate-100', iconClass: 'text-slate-600' }
]
</script>
