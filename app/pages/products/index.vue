<template>
  <div class="bg-white">
    <CorporatePageHero
      :subtitle="productsBanner.subtitle || 'Ready-to-adapt product packages and implementation starters managed from the Havor dashboard.'"
      kicker="Products"
      :image="heroImage"
      image-alt="Havor digital product workspace"
    />

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <SectionHeading
          title="Product Solutions"
          description="Explore practical digital product packages that can support website delivery, content operations, attendance, reporting, and API integration work."
        />

        <div v-if="products.length" class="mt-8 grid gap-5 border-y border-[#dbe6f4] py-5 lg:grid-cols-[0.42fr_0.58fr]" v-motion-fade-up>
          <div>
            <label for="product-category" class="brand-meta">Product Category</label>
            <select
              id="product-category"
              v-model="selectedCategory"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div>
            <label for="product-search" class="brand-meta">Search Product</label>
            <input
              id="product-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search product name, category, or description"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition placeholder:text-slate-400 focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
        </div>

        <div v-if="isLoading && !products.length" class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="item in 6" :key="item" class="brand-skeleton h-72"></div>
        </div>

        <div v-else-if="products.length && filteredProducts.length" class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="product in filteredProducts"
            :key="product.id"
            :to="`/products/${product.slug}`"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_14px_42px_rgba(18,56,122,0.07)]"
            :aria-label="`Open product detail: ${product.name}`"
            v-motion-fade-up
          >
            <img
              :src="product.image_url || fallbackImage"
              :alt="product.name"
              class="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            >
            <div class="p-4">
              <p v-if="product.categoryName" class="brand-meta">{{ product.categoryName }}</p>
              <h2 class="mt-3 line-clamp-2 text-[1.08rem] font-semibold leading-tight text-[#0e2344]">{{ product.name }}</h2>
              <p class="mt-2 line-clamp-3 text-[0.84rem] leading-6 text-slate-600">{{ stripHtml(product.description) }}</p>
              <span class="btn-outline mt-4 px-4 py-2 text-xs">View Product</span>
            </div>
          </NuxtLink>
        </div>
        <div v-else-if="products.length" class="mt-8 brand-soft-panel p-8 text-center">
          <p class="text-[1rem] font-semibold text-[#0e2344]">No products match your filter.</p>
          <p class="mt-2 text-[0.92rem] leading-6 text-slate-600">
            Try another category or broaden your search keyword.
          </p>
          <button @click="selectedCategory = 'All categories'; searchQuery = ''" class="btn-outline mt-6 inline-flex">
            Clear All Filters
          </button>
        </div>

        <div v-else class="mt-8 brand-soft-panel p-6 text-center">
          <p class="font-medium text-slate-500">Product content is being prepared.</p>
        </div>
      </div>
    </section>

    <PublicImageCta
      title="Need a Custom Digital Product?"
      copy="Discuss how Havor can adapt a product package into a website, dashboard, CMS, or business system that fits your workflow."
      :image="heroImage"
      image-alt="Digital product consultation"
      action-label="Contact Us"
      href="mailto:bisnis@havorsmartadigital.com?subject=Digital%20Product%20Consultation"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

definePageMeta({ layout: 'public' })

usePageSeo({
  title: 'Products | PT Havor SMART Digital',
  description: 'Explore Havor Smarta Digital product packages and implementation starters for websites, CMS, reporting dashboards, attendance, and API integration.',
  path: '/products'
})

const { products, isLoading, fetchProducts } = useProducts()
const { fetchBanners, useBannerPage } = useBanners()
const productsBanner = useBannerPage('products', 'product')
const defaultHeroImage = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80'
const fallbackImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
const heroImage = computed(() => productsBanner.value.media_url || defaultHeroImage)
const selectedCategory = ref('All categories')
const searchQuery = ref('')
const stripHtml = (value = '') => String(value || '').replace(/<[^>]*>?/gm, '').trim()

onMounted(() => {
  fetchProducts()
  fetchBanners()
})

const categoryOptions = computed(() => [
  'All categories',
  ...new Set(products.value.map((product) => product.categoryName || 'Uncategorized'))
])

const filteredProducts = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return products.value.filter((product) => {
    const productCategory = product.categoryName || 'Uncategorized'
    const matchesCategory = selectedCategory.value === 'All categories' || productCategory === selectedCategory.value
    const matchesKeyword =
      !keyword ||
      product.name.toLowerCase().includes(keyword) ||
      stripHtml(product.description).toLowerCase().includes(keyword) ||
      productCategory.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})
</script>
