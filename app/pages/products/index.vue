<template>
  <div class="bg-white">
    <CorporatePageHero
      :title="productsBanner.title || 'Digital Products'"
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

        <div v-if="isLoading && !products.length" class="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="item in 6" :key="item" class="brand-skeleton h-80"></div>
        </div>

        <div v-else-if="products.length" class="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="product in products"
            :key="product.id"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_14px_42px_rgba(18,56,122,0.07)]"
            v-motion-fade-up
          >
            <img
              :src="product.image_url || fallbackImage"
              :alt="product.name"
              class="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            >
            <div class="p-6">
              <p v-if="product.categoryName" class="brand-meta">{{ product.categoryName }}</p>
              <h2 class="mt-3 text-xl font-semibold leading-tight text-[#0e2344]">{{ product.name }}</h2>
              <p class="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{{ stripHtml(product.description) }}</p>
              <a
                v-if="product.external_link"
                :href="product.external_link"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline mt-6 px-4 py-2.5 text-xs"
              >
                View Product
              </a>
            </div>
          </article>
        </div>

        <div v-else class="mt-10 brand-soft-panel p-8 text-center">
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
const { fetchBannerPage, useBannerPage } = useBanners()
const productsBanner = useBannerPage('products')
const defaultHeroImage = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80'
const fallbackImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
const heroImage = computed(() => productsBanner.value.media_url || defaultHeroImage)

onMounted(() => {
  fetchProducts()
  fetchBannerPage('products')
})
</script>
