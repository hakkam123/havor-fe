<script setup>
const route = useRoute()
await navigateTo(`/media-news/${String(route.params.slug || '')}`, { replace: true })
</script>
