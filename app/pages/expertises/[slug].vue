<script setup>
const route = useRoute()
await navigateTo(`/services/${String(route.params.slug || '')}`, { replace: true })
</script>
