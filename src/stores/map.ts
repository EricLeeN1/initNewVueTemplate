import { getUrlParamsAndMergeDefaultMapParams } from '@/utils/mapHelper';
import {
    DEFAULT_PITCH,
    DEFAULT_ROTATION,
    DEFAULT_ZOOM,
    MAP_CENTER,
} from '@/utils/mapConstant';
import { loadAmapScriptWithLoca } from '@/utils/tryLoadAmapScript';
import { defineStore } from 'pinia';
import router from '@/routers';

interface MapStoreState {
    mapContainerId: string;
    $map: any;
    scriptLoaded: boolean;
    mapInitCompleted: boolean;
    $Layer: any;
    $LayerType: string;
}

export const useMapStore = defineStore('map', {
    state: (): MapStoreState => {
        return {
            mapContainerId:
                'id-map-container-' + Math.round(Math.random() * 100000000),
            $map: null,
            scriptLoaded: false,
            mapInitCompleted: false,
            $Layer: null,
            $LayerType: '',
        };
    },
    getters: {
        currentRoute() {
            return router.currentRoute.value;
        },
    },
    actions: {
        indexViewControl() {},

        updateKey<T extends keyof MapStoreState>(key: T, value: any) {
            this[key] = value;
        },
        // 添加自有数据图层
        addLayer() {
            // new AMap.ImageLayer 图片图层
            // new AMap.CanvasLayer canvas图层
            // new AMap.HeatMap 热力图层
            // new AMap.CustomLayer 自定义图层-SVG
            // new AMap.GLCustomLayer 自定义图层-GLCustomLayer 结合 THREE 利用 GLCustomLayer 和三方渲染引擎（three、regl 等）结合，绘制自定义的 三维数据。
            // new AMap.GLCustomLayer 自定义图层-GLCustomLayer 结合 ReGL 利用 GLCustomLayer 和三方渲染引擎（three、regl 等）结合，绘制自定义的 三维数据。
            // new AMap.3DTilesLayer 3D Tiles 图层 使用 AMap.3DTilesLayer 图层加载渲染标准 3D Tiles 数据，可支持 i3dm、b3dm、pnts 格式
            // new AMap.TileLayer.Flexible Canvas/Img作为切片 使用TileLayer.Flexible.createTile将canvas作为切片渲染到地图上，适用于需要自定义切片的场景。
        },
        // 添加MVT图层/MVT多面体;
        addMVT() {
            // 使用 AMap.MapboxVectorTileLayer 插件提供了简易矢量瓦片图层 此图层可以使用标准的 MVT 瓦片服务作为数据源。
        },
        // 简易行政区图 https://lbs.amap.com/demo/javascript-api-v2/example/district/district-country
        addDistrictLayer() {
            // new AMap.DistrictLayer.Country // 国家 SOC 参数不一致
            // new AMap.DistrictLayer.World // 世界
            // new AMap.DistrictLayer.Province // 省区
        },
        // 坐标系转换
        // TODO https://lbs.amap.com/demo/javascript-api-v2/example/axis/transformate-between-coordinates-of-lnglat-and-map-container
        // 区域掩模
        //利用行政区查询获取边界构建mask路径
        //也可以直接通过经纬度构建mask路径
        // TODO https://lbs.amap.com/demo/javascript-api-v2/example/3d/mask
        setMapFeatures() {
            const features: any[] = ['bg', 'road', 'building', 'point'];
            // const inputs = document.querySelectorAll('#map-features input');
            // inputs.forEach(function (input) {
            //     if (input.checked) {
            //         features.push(input.value);
            //     }
            // });
            this.$map.setFeatures(features);
        },
        lockMapBounds() {
            // 限制地图显示范围，超出范围会回弹
            const bounds = this.$map.getBounds();
            this.$map.setLimitBounds(bounds);
            this.getMapBoundsInfos();
        },
        gotoCity(value: string = '') {
            // 可以是cityname、adcode、citycode
            if (!value) {
                value = '灵宝市';
            }
            this.$map.setCity(value);
            console.info(`已跳转至${value}`);
        },
        getCityInfos() {
            this.$map.getCity((info: any) => {
                console.log(info);
                // const node = new PrettyJSON.view.Node({
                //     el: document.querySelector("#map-city"),
                //     data: info
                // });
            });
        },
        createContent(poi: any) {
            //信息窗体内容
            const s = [];
            s.push(
                '<div class="info-title">' +
                    poi.name +
                    '</div><div class="info-content">' +
                    '地址：' +
                    poi.address,
            );
            s.push('电话：' + poi.tel);
            s.push('类型：' + poi.type);
            s.push('<div>');
            return s.join('<br>');
        },
        //回调函数
        placeSearch_CallBack(data: any) {
            //infoWindow.open(map, result.lnglat);
            const infoWindow = new window.AMap.InfoWindow({});
            const poiArr = data.poiList.pois;
            if (poiArr[0]) {
                const location = poiArr[0].location;
                infoWindow.setContent(this.createContent(poiArr[0]));
                infoWindow.open(this.$map, location);
            }
        },
        getHotSpotInfos(res: any) {
            const placeSearch = new window.AMap.PlaceSearch(); //构造地点查询类
            placeSearch.getDetails(res.id, (status: any, result: any) => {
                console.log(status, result, 'details');
                if (status === 'complete' && result.info === 'OK') {
                    this.placeSearch_CallBack(result);
                }
            });
        },
        // 获取当前地图边界范围坐标
        getMapBoundsInfos() {
            const limitBounds = this.$map.getLimitBounds();
            if (limitBounds) {
                // 限定范围
                console.log(
                    '限定范围：',
                    limitBounds.northEast.toString(),
                    limitBounds.southWest.toString(),
                );
            } else {
                // 未限定范围
                const bounds = this.$map.getBounds();
                console.log(
                    '未限定范围：',
                    bounds.northEast.toString(),
                    bounds.southWest.toString(),
                );
            }
        },
        getClickInfos(e: any) {
            console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
        },
        getMapInfos() {
            console.log(this.$map);
            console.log(this.$map.getZoom()); //获取当前地图级别
            console.log(this.$map.getCenter()); //获取当前地图中心位置
        },
        setMap(key: string, value: any) {
            if (key == 'zoom') {
                this.$map.setZoom(value); //设置地图层级
            } else if (key == 'center') {
                this.$map.setCenter(value); //设置地图中心位置value = [lng, lat]
            } else if (key == 'pitch') {
                this.$map.setPitch(value); //设置地图俯仰角度
            } else if (key == 'opacity') {
                this.$map.setOpacity(value); //设置地图透明度
            } else if (key == 'zIndex') {
                this.$map.setzIndex(value); //设置图层的层级
            } else if (key == 'rotation') {
                this.$map.setRotation(value); //设置地图旋转角度
            } else if (key == 'zoomAndCenter') {
                // 同时设置地图层级与中心点
                const { zoom, LngLat } = value;
                this.$map.setZoomAndCenter(zoom, LngLat); // value = {zoom, LngLat:[lng, lat]}
            } else if (key == 'bounds') {
                // 设置显示范围
                const bounds = new window.AMap.Bounds(value[0], value[1]); // nouthWest:LngLat, northEast:LngLat
                this.$map.setBounds(bounds); //  value =  [LngLat,LngLat]
            } else if (key == 'cursor') {
                // 设置鼠标样式
                this.$map.setDefaultCursor(value); // value =  default/pointer/move/crosshair
            } else if (key == 'status') {
                // 设置地图状态
                // const mapOpts = {
                //     showIndoorMap: false, // 是否在有矢量底图的时候自动展示室内地图，PC默认true,移动端默认false
                //     dragEnable: false, // 地图是否可通过鼠标拖拽平移，默认为true
                //     keyboardEnable: false, //地图是否可通过键盘控制，默认为true
                //     doubleClickZoom: false, // 地图是否可通过双击鼠标放大地图，默认为true
                //     zoomEnable: false, //地图是否可缩放，默认值为true
                //     rotateEnable: false, // 地图是否可旋转，3D视图默认为true，2D视图默认false
                // }
                this.$map.setStatus({
                    dragEnable: true,
                    keyboardEnable: true,
                    doubleClickZoom: true,
                    zoomEnable: true,
                    rotateEnable: true,
                });
            }
        },
        // 销毁地图
        destoryMap() {
            // 销毁地图相关实例,清理干净现场
            if (this.$map) {
                this.$map.destroy();
                this.$map = null;
                this.updateKey('$map', null);
            }
        },
        toggleControl() {
            const scale = new window.AMap.Scale();
            const toolBar = new window.AMap.ToolBar({
                position: {
                    top: '110px',
                    right: '40px',
                },
            });
            const controlBar = new window.AMap.ControlBar({
                position: {
                    top: '10px',
                    right: '10px',
                },
            });
            const overView = new window.AMap.HawkEye({
                opened: false,
            });
            this.$map?.addControl(scale); // 比例尺
            this.$map?.addControl(toolBar); // 工具条
            this.$map?.addControl(controlBar); // 工具条方向盘
            this.$map?.addControl(overView); // 显示鹰眼
            // 监听复选框的点击事件
            // if (checkbox.checked) { //
            //     scale/toolBar/controlBar/overView.show(); //
            // } else {
            //     scale/toolBar/controlBar/overView.hide(); //
            // }
        },
        /**
         * addTileLayer 添加图层
         * @param {string} type
         */
        addTileLayer(type: string) {
            if (!type) {
                return false;
            }
            if (this.$Layer && this.$LayerType) {
                this.$Layer?.hide();
                this.$Layer = null;
                console.log('移除了吗');
                return false;
            }
            let $layer = '';
            const options = { zIndex: 2 };
            switch (type) {
                case 'Satellite': // 构造官方卫星图层
                    $layer = new window.AMap.TileLayer.Satellite(options);
                    break;
                case 'RoadNet': // 路网图层
                    $layer = new window.AMap.TileLayer.RoadNet(options);
                    break;
                case 'Traffic': // 构造官方实时路况图层
                    $layer = new window.AMap.TileLayer.Traffic(options);
                    break;
                default:
                    break;
            }
            this.$Layer = $layer;
            this.$map?.add($layer);
        },
        // 基础方法-覆盖物的添加与移除，添加，移除
        addPoint(point: any) {
            // 添加 Marker polygon Circle line 等，也可以添加图层,可以一个也可以[maker，polyline, polygon]多个
            this.$map?.add(point);
            // 自动适配到指定视野范围([maker1,maker2,maker3]) 无参数时，自动自适应所有覆盖物
            this.$map?.setFitView();
        },
        removePoint(point: any) {
            // 移除 Marker polygon Circle line 等，也可以移除图层,可以一个也可以[maker，polyline, polygon]多个
            this.$map?.remove(point);
            this.$map?.setFitView();
        },
        // 设置缩放级别和地图中心点
        setZoomAndCenter(
            center = MAP_CENTER,
            zoom = DEFAULT_ZOOM,
            pitch = DEFAULT_PITCH,
        ) {
            console.log('突然执行了', zoom, center, pitch);
            const numCenter = center.map((item) => item - 0);
            this.$map?.setZoomAndCenter(zoom, numCenter, true, 500);
            this.$map?.setPitch(pitch, false, 200);
        },
        // 第一步，加载脚本
        async loadAmapScript() {
            const AMap = await loadAmapScriptWithLoca([
                'AMap.Scale',
                'AMap.PlaceSearch',
            ]);
            this.scriptLoaded = true;
            this.initLoca(AMap);
        },
        initLoca(AMap: any) {
            const option = getUrlParamsAndMergeDefaultMapParams({
                terrain: true,
                viewMode: '3D',
                // mapStyle: 'amap://styles/normal',
                // mapStyle: 'amap://styles/45311ae996a8bea0da10ad5151f72979',
                // mapStyle: 'amap://styles/509934ebf66e54cbfe10ccae0056c462',
                showBuildingBlock: false,
                showLabel: true,
                // showLabel: false, //不显示地图文字标记
                layers: [
                    //只显示默认图层的时候，layers可以缺省
                    AMap.createDefaultLayer(), // 高德默认标准图层
                    new AMap.TileLayer.Traffic(), // 使用TileLayer.Traffic在地图上添加实时交通图，适用于显示实时交通的场景。
                    new AMap.TileLayer.Satellite(), // 使用TileLayer.Satellite添加卫星图到地图上，适用于显示卫星影像的场景。
                    new AMap.TileLayer.RoadNet(), // 使用TileLayer.RoadNet添加路网到地图上。
                    new AMap.Buildings({
                        // 楼块图层
                        zooms: [16, 18],
                        zIndex: 10,
                        heightFactor: 2, //2倍于默认高度，3D下有效
                    }),
                ],
                zooms: [2, 20],
                zoom: DEFAULT_ZOOM,
                center: MAP_CENTER,
                pitch: DEFAULT_PITCH,
                rotation: DEFAULT_ROTATION,
                zIndex: 1,
                isHotspot: true, // isHotspot开启地图的热点功能
                features: ['bg', 'road', 'building', 'point'], // 设置地图显示要素
                // zIndex: 2,
            });
            // 创建地图
            this.$map = new AMap.Map(this.mapContainerId, option);
            this.$map?.on('complete', () => {
                this.$map.addControl(new AMap.Scale()); //添加比例尺组件到地图实例上
                this.mapInitCompleted = true;
                // mitt.emit('initInfosWindow');
                // 添加城镇区域
                // this.initLoca();
                // this.AddTownData();
            });
            this.$map?.on('click', (e: any) => {
                console.log(e);
                this.getClickInfos(e);
                this.gotoCity('');
                this.getCityInfos();
                this.getMapBoundsInfos();
                // mitt.emit('initInfosWindow');
                // 添加城镇区域
                // this.initLoca();
                // this.AddTownData();
            });
            this.$map?.on('hotspotover', (result: any) => {
                console.log(result);
                this.getHotSpotInfos(result);
            });
            // const loca = new window.Loca.Container({
            //   map: this.$map,
            // });
            console.log(this.$map);
            // 地图事件
            // 地图加载完成事件 complete map.on('complete', ()=>{})
            // 地图点击完成事件 click，dblclick map.on('click', ()=>{})
            // 地图鼠标移动事件 mousemove map.on('mousemove', ()=>{})
            // 地图上热点鼠标移动事件 hotspotover map.on('hotspotover', ()=>{})
            // 地图移动相关事件 movestart，mapmove，moveend map.on('movestart', ()=>{}) map.off('movestart', ()=>{})
            // 地图缩放相关事件 zoomstart，zoomchange，zoomend map.on('zoomstart', ()=>{}) map.off('zoomstart', ()=>{})
            // 地图拖拽相关事件 dragstart，dragging，dragend map.on('dragstart', ()=>{}) map.off('dragstart', ()=>{})
            // 覆盖物点击和鼠标事件 click，mouseover，mouseout marker/circle/polygon.on('click', ()=>{}) marker/circle/polygon.off('click', ()=>{})
            // 覆盖物拖拽相关事件 click marker/circle/polygon.on('dragging', ()=>{}) marker/circle/polygon.off('dragging', ()=>{})
            // 信息窗体打开关闭事件 open,close infoWindow.on('open', ()=>{}) infoWindow.close()
            // 使用Map的emit和on方法，绑定和触发自定义事件 map.on('count', ()=>{}) map.emit('count', ()=>{})
        },
    },
});
