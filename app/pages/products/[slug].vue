<template>
  <div class="overflow-hidden bg-white">
    <PublicDetailHero
      :image="product?.image_url || fallbackImage"
      :image-alt="product?.name || 'Product hero image'"
      label="Product Detail"
    />

    <section class="bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div v-if="product" class="mx-auto max-w-4xl text-center">
          <p class="text-[0.72rem] font-semibold uppercase tracking-normal text-[#1f5dcc]">
            {{ product.categoryName || 'Digital Product' }}
          </p>
          <h1 class="mt-4 text-[clamp(2rem,4.2vw,3.65rem)] font-semibold leading-tight tracking-normal text-[#0e2344]">
            {{ product.name }}
          </h1>
        </div>

        <div v-else class="brand-panel p-6 text-center">
          <h1 class="text-3xl font-semibold tracking-normal text-[#0e2344]">Product not found</h1>
          <p class="mt-3 text-sm leading-7 text-slate-600">The product you requested is not available in the current product library.</p>
          <NuxtLink to="/products" class="btn-primary mt-6 inline-flex">Back to Products</NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="product" class="border-t border-[#dbe6f4] bg-white py-12">
      <div class="marketing-container">
        <div class="grid gap-10 lg:grid-cols-[4rem_minmax(0,1fr)_18rem]">
          <aside class="hidden lg:block" v-motion-fade-up>
            <div class="sticky top-28">
              <p class="brand-meta">Share</p>
              <div class="mt-4 flex flex-col gap-3">
                <NuxtLink to="/products" class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]" aria-label="Back to products">
                  <ArrowLeft class="h-4 w-4" />
                </NuxtLink>
                <NuxtLink to="/contact" class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]" aria-label="Discuss product">
                  <Mail class="h-4 w-4" />
                </NuxtLink>
              </div>
            </div>
          </aside>

          <article class="min-w-0" v-motion-fade-up>
            <div class="detail-content">
              <p>{{ productSummary }}</p>
              <h2>Product Use Case</h2>
              <p>
                This product package is prepared to help organizations start faster with a clearer scope, practical implementation path, and reusable digital foundation.
              </p>
              <h2>Implementation Support</h2>
              <p>
                Havor can adapt this product into a website, CMS, dashboard, API integration, or operational system based on the workflow and business requirements.
              </p>
            </div>
          </article>

          <aside class="space-y-8" v-motion-fade-up>
            <div>
              <h2 class="text-[1.3rem] font-semibold text-[#0e2344]">Category</h2>
              <div class="mt-3 h-0.5 w-8 bg-[#1f5dcc]"></div>
              <div class="mt-6 space-y-4">
                <NuxtLink
                  v-for="item in categoryCards"
                  :key="item.slug"
                  :to="`/products/${item.slug}`"
                  class="group relative block min-h-28 overflow-hidden rounded-lg bg-[#071529]"
                >
                  <img :src="item.image_url || fallbackImage" :alt="item.categoryName || item.name" class="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.04]">
                  <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,41,0.22)_0%,rgba(7,21,41,0.86)_100%)]"></div>
                  <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
                    <span class="text-[0.74rem] font-semibold uppercase tracking-normal">{{ item.categoryName || 'Product' }}</span>
                    <ArrowUpRight class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </NuxtLink>
              </div>
            </div>

            <div class="rounded-lg bg-[#0d3b91] p-5 text-white">
              <p class="text-[0.75rem] font-medium uppercase tracking-normal text-white/70">Need This Product?</p>
              <h3 class="mt-3 text-lg font-semibold leading-tight">Discuss how Havor can adapt it to your business flow.</h3>
              <a
                v-if="product.external_link"
                :href="product.external_link"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-5 inline-flex text-sm font-medium text-white/88 hover:text-white"
              >
                Open product link
              </a>
              <NuxtLink v-else to="/contact" class="mt-5 inline-flex text-sm font-medium text-white/88 hover:text-white">
                Contact us
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section v-if="product && relatedProducts.length" class="border-t border-[#dbe6f4] bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="border-l-2 border-[#1f5dcc] pl-5 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold text-[#0e2344]">
            Related Products
          </h2>
          <NuxtLink to="/products" class="btn-outline">View All</NuxtLink>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <NuxtLink
            v-for="item in relatedProducts"
            :key="item.slug"
            :to="`/products/${item.slug}`"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            v-motion-fade-up
          >
            <img :src="item.image_url || fallbackImage" :alt="item.name" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta text-[#1f5dcc]">{{ item.categoryName || 'Product' }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ item.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const fallbackImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
const toPlainText = (value = '') => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const { products, fetchProducts, error } = useProducts()

onMounted(async () => {
  await fetchProducts()

  if (!error.value && !product.value) {
    showError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }
})

const product = computed(() => products.value.find((item) => item.slug === slug.value) || null)
const productSummary = computed(() => toPlainText(product.value?.description) || 'Explore this Havor digital product package and its implementation fit.')
const relatedProducts = computed(() => products.value.filter((item) => item.slug !== slug.value).slice(0, 3))
const categoryCards = computed(() => {
  const categoryMap = new Map<string, typeof products.value[number]>()

  products.value.forEach((item) => {
    const key = item.categoryName || item.name
    if (!categoryMap.has(key)) categoryMap.set(key, item)
  })

  return [...categoryMap.values()].slice(0, 4)
})

usePageSeo({
  title: computed(() => product.value ? `${product.value.name} | Products | PT Havor SMART Digital` : 'Product Detail | PT Havor SMART Digital'),
  description: productSummary,
  path: computed(() => `/products/${slug.value}`),
  image: computed(() => product.value?.image_url || fallbackImage),
  type: 'article'
})
</script>
