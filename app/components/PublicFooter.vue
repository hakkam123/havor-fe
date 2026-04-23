<template>
  <footer class="border-t border-[#dbe6f4] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)]">
    <div class="marketing-container py-16">
      <div class="grid gap-10 lg:grid-cols-[1.2fr_0.85fr_0.85fr_0.9fr]">
        <div>
          <div class="mb-5 inline-flex items-center gap-3 rounded-full border border-[#d8e6fb] bg-white px-3 py-2 shadow-[0_16px_40px_rgba(18,56,122,0.08)]">
            <img src="/logo-havor.svg" alt="Havor Smarta Digital" class="h-10 w-10 rounded-full object-cover">
            <div>
              <p class="text-sm font-extrabold text-[#0e2344]">Havor Smarta Digital</p>
            </div>
          </div>
          <p class="max-w-md text-sm leading-7 text-slate-600">
            Havor Smarta Digital provides structured digital services across web, mobile, software delivery, system integration, UI/UX, consulting, and long-term maintenance support.
          </p>
        </div>

        <div>
          <p class="text-sm font-extrabold uppercase tracking-[0.18em] text-[#5374a8]">Company</p>
          <ul class="mt-4 space-y-3 text-sm font-semibold text-slate-600">
            <li><NuxtLink to="/about-us" class="hover:text-[#1f5dcc]">About Us</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-[#1f5dcc]">Services</NuxtLink></li>
            <li><NuxtLink to="/projects" class="hover:text-[#1f5dcc]">Projects</NuxtLink></li>
            <li><NuxtLink to="/media-news" class="hover:text-[#1f5dcc]">Media & News</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-extrabold uppercase tracking-[0.18em] text-[#5374a8]">Capabilities</p>
          <ul class="mt-4 space-y-3 text-sm font-semibold text-slate-600">
            <li>Custom Software Development</li>
            <li>Mobile App Development</li>
            <li>UI/UX Design</li>
            <li>Maintenance & Support</li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-extrabold uppercase tracking-[0.18em] text-[#5374a8]">Contact</p>
          <ul class="mt-4 space-y-3 text-sm font-semibold text-slate-600">
            <li>hello@havorsmartdigital.com</li>
            <li>+62 21 3972 1808</li>
            <li>Jakarta, Indonesia</li>
          </ul>
          <NuxtLink to="/#contact" class="btn-outline mt-5">
            Start a Conversation
          </NuxtLink>
        </div>
      </div>

      <div class="mt-10 flex flex-col gap-3 border-t border-[#dbe6f4] pt-6 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 PT Havor Smarta Digital. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about-us" class="hover:text-[#1f5dcc]">Privacy Policy</NuxtLink>
          <NuxtLink to="/about-us" class="hover:text-[#1f5dcc]">Terms of Service</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
