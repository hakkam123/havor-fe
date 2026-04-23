<script setup>
const route = useRoute()
await navigateTo(`/projects/${String(route.params.slug || '')}`, { replace: true })
</script>
