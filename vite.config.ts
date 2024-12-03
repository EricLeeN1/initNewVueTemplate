import { defineConfig, loadEnv } from 'vite';
import Vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'; // 依赖按需自动导入
import Components from 'unplugin-vue-components/vite';
import eslintPlugin from 'vite-plugin-eslint';
import { viteMockServe } from 'vite-plugin-mock'; // mock数据
import { visualizer } from 'rollup-plugin-visualizer'; // 包依赖分析可视化
import compressPlugin from 'vite-plugin-compression'; // 代码压缩
import proxy from './config/vite/proxy';
import { VITE_PORT, VITE_DROP_CONSOLE } from './config/constant';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
// import OptimizationPersist from "vite-plugin-optimize-persist"; // 资源预构建
// import PkgConfig from "vite-plugin-package-config";
// TODO : 配置mock
// TODO : 配置资源预构建
// TODO : 配置包依赖分析可视化;

console.log(visualizer, 'visualizer');

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    console.log(command, mode, process.cwd());
    // 根据模式读取不同的环境变量
    // const env = loadEnv(mode, process.cwd(), '');
    const env = loadEnv(mode, process.cwd());
    console.log(env);
    return {
        base: env.VITE_APP_BASE_URL,
        // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换。
        define: {
            __APP_VERSION__: JSON.stringify('v1.0.0'),
            'process.env': env,
        },
        plugins: [
            Vue(),
            VueSetupExtend(),
            // PkgConfig({}),
            // OptimizationPersist(),
            AutoImport({
                // targets to transform
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/, // .md
                ],
                dts: 'src/auto-imports.d.ts',

                // global imports to register
                imports: [
                    // presets
                    'vue',
                    'vue-router',
                    // custom
                    {
                        '@vueuse/core': [
                            // named imports
                            'useMouse', // import { useMouse } from '@vueuse/core',
                            'useTimestamp',
                            'useFullscreen',
                            // alias
                            ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
                        ],
                        // axios: [
                        //   // default imports
                        //   ["default", "axios"], // import { default as axios } from 'axios',
                        // ],
                        // "[package-name]": [
                        //   "[import-names]",
                        //   // alias
                        //   ["[from]", "[alias]"],
                        // ],
                    },
                ],

                // custom resolvers
                // see https://github.com/antfu/unplugin-auto-import/pull/23/
                resolvers: [],
            }),
            Components({
                dts: 'src/components.d.ts',
                resolvers: [],
            }),
            eslintPlugin({
                // 配置
                cache: false, // 禁用 eslint 缓存减少执行时间
                fix: true, // 自动修复源代码。
                // eslintPath // 用于校验的 eslint 实例路径。
                // lintOnStart // 启动项目时检查所有匹配的文件，速度较慢，请谨慎开启。
                // include: [], // 单个文件或要包含在校验中的文件数组。 默认值['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.vue', '**/*.svelte']
                exclude: [], // 单个文件或要排除在校验中的文件数组。 默认值['**/node_modules/**']
            }),
            viteMockServe({
                mockPath: 'mock',
                configPath: '',
                ignore: /^\_/,
                enable: true,
                watchFiles: true,
                logger: true,
                cors: true,
                // 开发环境无需关心
                // injectCode 只受prodEnabled影响
                // https://github.com/anncwb/vite-plugin-mock/issues/9
                // 下面这段代码会被注入 main.ts
                // injectCode: `
                //     import { setupProdMockServer } from '../mock/_createProductionServer';

                //     setupProdMockServer();
                //     `,
            }),
            visualizer({
                filename: './node_modules/.cache/visualizer/stats.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
            }),
            compressPlugin({
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: 'gzip',
                ext: '.gz',
            }),
        ],
        resolve: {
            //设置别名
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    javascriptEnabled: true,
                    additionalData: `
                        @use "@/styles/variables.scss" as *;
                        @use "@/styles/mixins.scss" as *;
                    `,
                },
            },
        },
        build: {
            // 生产环境去除 console debugger
            terserOptions: {
                compress: {
                    drop_console: VITE_DROP_CONSOLE,
                    drop_debugger: true,
                },
            },
            rollupOptions: {
                treeshake: true, // 开启 Tree Shaking，消除未使用的代码，减小最终的包大小
            },
        },
        server: {
            port: VITE_PORT, //启动端口
            hmr: {
                host: '127.0.0.1',
                port: VITE_PORT,
            },
            open: true,
            // 为开发服务器配置 CORS。默认启用并允许任何源，
            cors: true,
            // 设置 https 代理
            proxy: proxy,
        },
    };
});
