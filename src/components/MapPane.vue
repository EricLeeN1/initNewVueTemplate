<template>
    <div class="map-container">
        <div :id="mapContainerId" class="map-bg"></div>
    </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/map';
const mapStore = useMapStore();
const mapContainerId = computed(() => mapStore.mapContainerId);
onMounted(() => {
    mapStore.loadAmapScript();
});
</script>

<style scoped lang="scss">
.map-container {
    height: 100vh;
    width: 100vw;

    .map-bg {
        height: 100%;
        width: 100%;
    }
}
</style>
