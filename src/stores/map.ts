import { getUrlParamsAndMergeDefaultMapParams } from '@/utils/mapHelper';
import {
    defaultPitch,
    defaultRotation,
    defaultZoom,
    mapCenter,
} from '@/utils/point';
import { loadAmapScriptWithLoca } from '@/utils/tryLoadAmapScript';
import { defineStore } from 'pinia';
import router from '@/routers';

export const useMapStore = defineStore('map', {
    state: () => {
        const mapContainerId =
            'id-map-container-' + Math.round(Math.random() * 100000000);
        const $map = ref<any>(null);
        return {
            mapContainerId,
            $map,
            scriptLoaded: false,
            mapInitCompleted: false,
        };
    },
    getters: {
        currentRoute() {
            return router.currentRoute.value;
        },
    },
    actions: {
        indexViewControl() {},
        //
        // 加载脚本
        async loadAmapScript() {
            const AMap = await loadAmapScriptWithLoca();
            console.log(AMap);
            this.scriptLoaded = true;
            this.initLoca();
        },
        initLoca() {
            const option = getUrlParamsAndMergeDefaultMapParams({
                terrain: true,
                viewMode: '3D',
                mapStyle: 'amap://styles/45311ae996a8bea0da10ad5151f72979',
                // mapStyle: "amap://styles/509934ebf66e54cbfe10ccae0056c462",
                showBuildingBlock: false,
                showLabel: false,
                layers: [
                    window.AMap.createDefaultLayer(),
                    new window.AMap.TileLayer.Satellite(),
                ],
                zooms: [2, 20],
                zoom: defaultZoom,
                center: mapCenter,
                pitch: defaultPitch,
                rotation: defaultRotation,
                // zIndex: 2,
            });
            // 创建地图
            this.$map = new AMap.Map(this.mapContainerId, option);
            this.$map &&
                this.$map.on('complete', () => {
                    this.mapInitCompleted = true;
                    // document.querySelector('.start-btn').addEventListener('click', function () {
                    if (this.currentRoute.path === '/dashboard') {
                        setTimeout(() => {
                            this.indexViewControl();
                        }, 1000);
                    }
                    // mitt.emit('initInfosWindow');
                    // 添加城镇区域
                    // this.initLoca();
                    // this.AddTownData();
                });
            // const loca = new window.Loca.Container({
            //   map: this.$map,
            // });
            console.log(this.$map);
        },
    },
});
