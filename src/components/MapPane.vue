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

<style>
.info-title {
    font-weight: bolder;
    color: #000;
    font-size: 14px;
    width: 250px;
    line-height: 26px;
    padding: 0 0 0 6px;
}
.info-content {
    width: 250px;
    padding: 4px;
    color: #666666;
    line-height: 23px;
    font: 12px Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑',
        Arial;
}
.info-content img {
    float: left;
    margin: 3px;
}
</style>
