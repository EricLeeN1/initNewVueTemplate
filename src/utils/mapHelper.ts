import {
    DEFAULT_ZOOM,
    MAP_CENTER,
    DEFAULT_PITCH,
    DEFAULT_ROTATION,
} from './mapConstant';

/**
 * 向地图上添加一个纯图类型的点标记, 返回 marker 实例对象
 * @param mapInstance (必选)地图实例对象
 * @param position (必选)点标记左上角经纬度坐标, 可以是长度为2的数组.
 * @param imageUrl (必选)图片URL地址
 * @param imageSize (建议必选), 长度为2的数组,单位:像素. 即图片想要在地图上显示的尺寸, 建议和图片本身的尺寸保持一样的纵横比
 * @param imageStyles 图片附加style, 对象
 * @param extMarkerOptions (可选),对象 , 将覆盖默认参数以及前面的参数, 参考 https://lbs.amap.com/api/javascript-api-v2/documentation#marker
 */
export const addSimpleImageMarker = (
    mapInstance: any,
    position: any,
    imageUrl: any,
    imageSize = [100, 100],
    imageStyles: any = {},
    extMarkerOptions = {},
) => {
    if (imageSize.length !== 2) {
        return console.warn('参数: imageSize 错误!');
    }
    if (!imageUrl) {
        return console.warn('参数: imageUrl 缺少!');
    }
    const dom = document.createElement('div');
    dom.style.fontSize = '0px';
    const img: any = document.createElement('img');
    img.setAttribute('src', imageUrl);
    img.style.width = `${imageSize[0]}px`;
    img.style.height = `${imageSize[1]}px`;
    img.style.boxSizing = 'border-box';
    for (const k in imageStyles) {
        img.style[k] = imageStyles[k];
    }
    dom.append(img);
    const marker = new window.AMap.Marker({
        position: position,
        anchor: 'top-left',
        content: dom,
        ...extMarkerOptions,
    });
    marker.on('click', () => {
        const topLeftPosition = marker.getPosition();
        const topLeftPixel = mapInstance.lngLatToPixel(topLeftPosition);
        const rightBottomPixel = new window.AMap.Pixel(
            topLeftPixel.x + imageSize[0],
            topLeftPixel.y + imageSize[1],
        );
        const rightBottomPosition = mapInstance.pixelToLngLat(rightBottomPixel);
        console.log(
            `click:marker:: { position: [${topLeftPosition}] , bounds: [${topLeftPosition}], [${rightBottomPosition}] }`,
        );
    });
    mapInstance.add(marker);
    return marker;
};

// 从URL读取注入的参数, 如果参数有效则覆盖对应的地图初始化属性参数, 目前支持从URL覆盖 viewMode,mapStyle,skyColor,showIndoorMap,dragEnable,keyboardEnable,doubleClickZoom,zoomEnable,rotateEnable, center(对应参数lng,lat  或者对应参数 center经纬度用逗号分隔 ), zoom, pitch, rotation, 其余defaultParams内的属性将原封不动返回
export const getUrlParamsAndMergeDefaultMapParams = (
    defaultParams: any = {
        center: MAP_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: DEFAULT_PITCH,
        rotation: DEFAULT_ROTATION,
    },
) => {
    const resultMap = { ...defaultParams };
    const params: any = new URL(window.location.href).searchParams;
    let center = defaultParams.center;
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    if (!isNaN(lng) && !isNaN(lat)) {
        center = [lng, lat];
    }
    const _center = params.get('center');
    if (_center) {
        const arr = _center.split(',').map((v: any) => parseFloat(v));
        if (arr.length === 2 && !isNaN(arr[0]) && !isNaN(arr[1])) {
            center = arr;
        }
    }
    if (center) {
        resultMap.center = center;
    }
    const _zoom = parseFloat(params.get('zoom'));
    if (!isNaN(_zoom)) {
        resultMap.zoom = _zoom;
    }
    const _zooms = params.get('zooms');
    if (_zooms) {
        const arr = _zooms.split(',').map((v: any) => parseFloat(v));
        if (arr.length === 2 && !isNaN(arr[0]) && !isNaN(arr[1])) {
            resultMap.zooms = arr;
        }
    }
    const _pitch = parseFloat(params.get('pitch'));
    if (!isNaN(_pitch)) {
        resultMap.pitch = _pitch;
    }
    const _rotation = parseFloat(params.get('rotation'));
    if (!isNaN(_rotation)) {
        resultMap.rotation = _rotation;
    }
    const viewMode = params.get('viewMode');
    if (viewMode) {
        resultMap.viewMode = viewMode;
    }
    const mapStyle = params.get('mapStyle');
    if (mapStyle) {
        resultMap.mapStyle = mapStyle;
    }
    const skyColor = params.get('skyColor');
    if (skyColor) {
        resultMap.skyColor = skyColor;
    }
    const status: any = {};
    // 如果显式声明了 showIndoorMap,dragEnable,keyboardEnable,doubleClickZoom,zoomEnable,rotateEnable  为true/false, 则注入之, 否则不干预默认逻辑. 参考 https://lbs.amap.com/demo/javascript-api-v2/example/map/set-map-status
    [
        'showIndoorMap',
        'dragEnable',
        'keyboardEnable',
        'doubleClickZoom',
        'zoomEnable',
        'rotateEnable',
    ].forEach((k) => {
        const v = params.get(k);
        if (v === 'true') {
            status[k] = true;
        } else if (v === 'false') {
            status[k] = false;
        }
    });
    Object.assign(resultMap, status);
    // console.log("getUrlParamsAndMergeDefaultMapParams::生成参数==>", resultMap);
    return resultMap;
};
