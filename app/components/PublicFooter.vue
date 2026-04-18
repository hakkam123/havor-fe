<template>
  <footer class="bg-[#07142e] text-slate-200">
    <div class="marketing-container py-14">
      <div class="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div class="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-2.5 py-1">
            <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-[#07142e]">H</span>
            <span class="text-sm font-semibold">PT Havor Smarta</span>
          </div>
          <p class="max-w-sm text-sm leading-7 text-slate-300/90">
            Leading the way in digital innovation and enterprise solutions. Building trust through quality and speed.
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-white">Company</p>
          <ul class="mt-4 space-y-2.5 text-sm text-slate-300">
            <li><NuxtLink to="/about-us" class="hover:text-white">About Us</NuxtLink></li>
            <li><NuxtLink to="/careers" class="hover:text-white">Careers</NuxtLink></li>
            <li><NuxtLink to="/projects" class="hover:text-white">Partners</NuxtLink></li>
            <li><NuxtLink to="/media-news" class="hover:text-white">News</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-white">Services</p>
          <ul class="mt-4 space-y-2.5 text-sm text-slate-300">
            <li><NuxtLink to="/services" class="hover:text-white">Web Development</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-white">Mobile Apps</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-white">Cloud Services</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-white">Consulting</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-white">Contact</p>
          <ul class="mt-4 space-y-2.5 text-sm text-slate-300">
            <li>hello@havor.com</li>
            <li>+62 21 555 0199</li>
            <li>Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-col gap-3 border-t border-slate-700/70 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 PT Havor Smarta Digital. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about-us" class="hover:text-white">Privacy Policy</NuxtLink>
          <NuxtLink to="/about-us" class="hover:text-white">Terms of Service</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
