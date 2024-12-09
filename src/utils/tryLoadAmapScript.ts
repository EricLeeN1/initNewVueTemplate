import AMapLoader from '@amap/amap-jsapi-loader';
import { APP_KEY, SECURITY_JS_CODE } from './mapKey';
import { MAP_VERSION, DEFAULT_MAP_PLUGINS } from './mapConstant';

// 参考 https://lbs.amap.com/api/javascript-api-v2/guide/abc/jscode
window._AMapSecurityConfig = {
    securityJsCode: SECURITY_JS_CODE,
};

/**
 * 尝试载入高德地图js-sdk , 返回promise, 如果已载入,则立即返回 Promise.resolve() ,本方法可以反复重复调用无副作用.
 * @param plugins 地图插件
 * @param version 地图版本
 * @return {Promise<void>}
 */
export const tryLoadAmapScript = (config: any = {}) => {
    const mergedPlugins = [...DEFAULT_MAP_PLUGINS];
    if (config?.plugins?.length > 0) {
        config.plugins.forEach((p: any) => {
            if (!mergedPlugins.includes(p)) {
                mergedPlugins.push(p);
            }
        });
    }
    return AMapLoader.load({
        key: APP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: config?.version || MAP_VERSION, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: mergedPlugins, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    });
};

/**
 * LOCA 数据可视化 API,  执行完成后AMap也会被加载
 * @param plugins 地图插件
 * @return {Promise<void>}
 */
export const loadAmapScriptWithLoca = (plugins: string[] = []) => {
    const mergedPlugins = [...DEFAULT_MAP_PLUGINS];
    if (plugins.length > 0) {
        plugins.forEach((p) => {
            if (!mergedPlugins.includes(p)) {
                mergedPlugins.push(p);
            }
        });
    }
    return AMapLoader.load({
        key: APP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: MAP_VERSION, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: mergedPlugins, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        Loca: {
            version: '2.0.0', // Loca 版本，缺省 1.3.2
        },
        AMapUI: {
            //是否加载 AMapUI，缺省不加载
            version: '1.1', //AMapUI 版本
            plugins: ['overlay/SimpleMarker'], //需要加载的 AMapUI ui 插件
        },
    });
};

/**
 * (可多次调用) 引入UI组件库（1.1版本）, 载入完成后, AMap 和 AMapUI 将挂载至window
 * @param plugins AMapUI UI插件 , 详见 https://lbs.amap.com/api/amap-ui/intro
 */
export const tryLoadAMapUIScript = (plugins = []) => {
    return AMapLoader.load({
        key: APP_KEY,
        version: MAP_VERSION,
        AMapUI: {
            version: '1.1',
            plugins,
        },
    });
};

/**
 * (可多次调用) 尝试载入高德地图js-sdk 以及 UI组件库（1.1版本））, 载入完成后, AMap 和 AMapUI 将挂载至window
 * @param mapPlugins 地图插件, 详见 https://lbs.amap.com/api/jsapi-v2/guide/abc/plugins#plugins
 * @param uiPlugins AMapUI插件, 详见 https://lbs.amap.com/api/amap-ui/intro
 */
export const tryLoadAMapAndUIScript = (mapPlugins = [], uiPlugins = []) => {
    const mergedPlugins = [...DEFAULT_MAP_PLUGINS];
    if (mapPlugins && mapPlugins.length > 0) {
        mapPlugins.forEach((p) => {
            if (!mergedPlugins.includes(p)) {
                mergedPlugins.push(p);
            }
        });
    }
    return AMapLoader.load({
        key: APP_KEY,
        version: MAP_VERSION,
        plugins: mergedPlugins,
        AMapUI: {
            version: '1.1',
            plugins: uiPlugins,
        },
    });
};
