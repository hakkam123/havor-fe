<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="glass-panel p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Overview</p>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Content Operations</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            A cleaner dashboard focused on approvals, publishing flow, and recent activity across your CMS.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <Download class="h-4 w-4" />
            Export Report
          </button>
          <button class="btn-primary inline-flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Add New Item
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div class="glass-panel p-6">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Approval Snapshot</p>
            <p class="text-xs text-slate-500">Updated 12 minutes ago</p>
          </div>
          <button class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50">This Week</button>
        </div>

        <div class="grid gap-4 md:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{{ stat.label }}</span>
              <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="stat.iconWrapClass">
                <component :is="stat.icon" class="h-5 w-5" :class="stat.iconClass" />
              </div>
            </div>
            <div class="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{{ stat.value }}</div>
            <p class="mt-1 text-xs font-medium" :class="stat.deltaClass">{{ stat.delta }}</p>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Content Mix</p>
            <p class="text-xs text-slate-500">Distribution by content type</p>
          </div>
          <button class="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50">
            <Ellipsis class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="type in contentTypes" :key="type.label">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium text-slate-700">{{ type.label }}</span>
              <span class="font-medium text-slate-500">{{ type.total }}</span>
            </div>
            <div class="h-2 rounded-full bg-slate-100">
              <div class="h-2 rounded-full" :class="type.barClass" :style="{ width: `${type.width}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="glass-panel p-6">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="relative">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pending actions"
              class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200 sm:w-72"
            >
          </div>
          <div class="flex items-center gap-2">
            <button class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50">Month Period</button>
            <button class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50">All Status</button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50">General Setting</button>
          <button class="btn-primary">Approve All</button>
        </div>
      </div>

      <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Item</th>
                <th class="px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Type</th>
                <th class="px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Window</th>
                <th class="px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Summary</th>
                <th class="px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Attachment</th>
                <th class="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="row in approvalRows" :key="row.name" class="transition hover:bg-slate-50">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-medium" :class="row.avatarClass">
                      {{ row.initials }}
                    </div>
                    <div>
                      <p class="font-medium text-slate-900">{{ row.name }}</p>
                      <p class="text-xs text-slate-500">{{ row.owner }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{{ row.type }}</span>
                </td>
                <td class="px-5 py-4 text-sm text-slate-600">{{ row.window }}</td>
                <td class="px-5 py-4 text-sm text-slate-500">{{ row.reason }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Paperclip class="h-4 w-4" />
                    {{ row.attachment }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <span class="rounded-full px-3 py-1 text-xs font-medium" :class="row.statusClass">
                      {{ row.status }}
                    </span>
                    <button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="glass-panel p-6">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Recent Activity</p>
            <p class="text-xs text-slate-500">Live changes from your editors</p>
          </div>
          <button class="text-sm font-medium text-slate-600">View all</button>
        </div>

        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.title" class="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
            <div class="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl" :class="activity.iconWrapClass">
              <component :is="activity.icon" class="h-5 w-5" :class="activity.iconClass" />
            </div>
            <div>
              <p class="font-medium text-slate-900">{{ activity.title }}</p>
              <p class="mt-1 text-sm leading-6 text-slate-500">{{ activity.description }}</p>
              <p class="mt-2 text-xs font-medium text-slate-400">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Team Rhythm</p>
            <p class="text-xs text-slate-500">Approval velocity across the week</p>
          </div>
          <button class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50">Weekly</button>
        </div>

        <div class="grid gap-4 md:grid-cols-7">
          <div v-for="bar in performanceBars" :key="bar.day" class="flex flex-col items-center gap-3 rounded-xl bg-slate-50 px-4 py-5">
            <div class="flex h-44 items-end">
              <div
                class="w-8 rounded-full bg-slate-900"
                :style="{ height: `${bar.height}px` }"
              ></div>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-slate-700">{{ bar.day }}</p>
              <p class="text-xs text-slate-400">{{ bar.value }} items</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  Download,
  Plus,
  Search,
  Paperclip,
  Ellipsis,
  PackageSearch,
  Briefcase,
  Inbox,
  Newspaper,
  LayoutTemplate,
  ShieldCheck,
  Activity,
  Clock3
} from 'lucide-vue-next'

const stats = [
  { label: 'Requested', value: '265', delta: '+12 vs yesterday', icon: Inbox, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700', deltaClass: 'text-slate-500' },
  { label: 'Approved', value: '180', delta: '+6 cleared', icon: ShieldCheck, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700', deltaClass: 'text-slate-500' },
  { label: 'In Review', value: '42', delta: '+3 waiting response', icon: Activity, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700', deltaClass: 'text-slate-500' },
  { label: 'Pending', value: '18', delta: '-2 vs yesterday', icon: Clock3, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700', deltaClass: 'text-slate-500' }
]

const contentTypes = [
  { label: 'News Articles', total: 32, width: 78, barClass: 'bg-slate-900' },
  { label: 'Product Entries', total: 24, width: 62, barClass: 'bg-slate-700' },
  { label: 'Portfolio Works', total: 18, width: 44, barClass: 'bg-slate-500' },
  { label: 'Hero Banners', total: 9, width: 22, barClass: 'bg-slate-400' }
]

const approvalRows = [
  { name: 'Homepage launch banner', initials: 'HB', owner: 'Marketing Team', avatarClass: 'bg-slate-900', type: 'Banner', window: '26 Dec 2023 to 27 Dec 2023', reason: 'Refresh hero section for holiday promotion and homepage callout.', attachment: 'home-banner-v2.fig', status: 'Pending', statusClass: 'bg-slate-100 text-slate-600' },
  { name: 'Smart relay product update', initials: 'PR', owner: 'Product Team', avatarClass: 'bg-slate-700', type: 'Product', window: '18 Sep 2023 to 20 Sep 2023', reason: 'Add latest pricing block, spec sheet, and refreshed screenshots.', attachment: 'relay-update.pdf', status: 'Approved', statusClass: 'bg-slate-100 text-slate-600' },
  { name: 'Office opening story', initials: 'NW', owner: 'Editorial', avatarClass: 'bg-slate-600', type: 'News', window: '17 Sep 2023 to 21 Sep 2023', reason: 'Review the article draft, supporting gallery, and publishing status.', attachment: 'office-story.docx', status: 'In review', statusClass: 'bg-slate-100 text-slate-600' },
  { name: 'Hospital automation case study', initials: 'WK', owner: 'Portfolio', avatarClass: 'bg-slate-500', type: 'Work', window: '25 Aug 2023 to 29 Aug 2023', reason: 'Needs final description cleanup and image compression before publish.', attachment: 'automation-case.zip', status: 'Rejected', statusClass: 'bg-slate-100 text-slate-600' }
]

const activities = [
  { title: 'Banner assets reviewed', description: 'Creative team uploaded a lighter campaign banner and marked it ready for homepage approval.', time: '10 minutes ago', icon: LayoutTemplate, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700' },
  { title: 'Product library expanded', description: 'Three new product entries were added with category mapping and external links.', time: '2 hours ago', icon: PackageSearch, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700' },
  { title: 'Portfolio pipeline refreshed', description: 'Works collection is waiting on final imagery before the approval queue is cleared.', time: '5 hours ago', icon: Briefcase, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700' },
  { title: 'Editorial calendar updated', description: 'The news team published one article and scheduled two more drafts for review.', time: 'Yesterday', icon: Newspaper, iconWrapClass: 'bg-slate-200', iconClass: 'text-slate-700' }
]

const performanceBars = [
  { day: 'Mon', value: 14, height: 84 },
  { day: 'Tue', value: 19, height: 112 },
  { day: 'Wed', value: 17, height: 98 },
  { day: 'Thu', value: 23, height: 138 },
  { day: 'Fri', value: 20, height: 122 },
  { day: 'Sat', value: 9, height: 62 },
  { day: 'Sun', value: 6, height: 48 }
]
</script>
