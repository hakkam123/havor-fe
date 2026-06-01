<template>
  <div class="marketing-shell">
    <PublicNavbar />
    <main>
      <slot />
    </main>
    <PublicFooter />
  </div>
</template>

<script setup lang="ts">
const { company } = useCorporateContent()
const config = useRuntimeConfig()

useHead(() => {
  const siteUrl = String(config.public.siteUrl || 'https://havorsmarta.netlify.app').replace(/\/$/, '')

  return {
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: company.name,
          alternateName: company.shortName,
          url: siteUrl,
          logo: `${siteUrl}/logo-havor.svg`,
          email: company.email,
          telephone: company.phones,
          address: {
            '@type': 'PostalAddress',
            streetAddress: company.office,
            addressLocality: 'Jakarta Selatan',
            addressRegion: 'DKI Jakarta',
            addressCountry: 'ID'
          },
          description: company.tagline
        })
      }
    ]
  }
})
</script>
