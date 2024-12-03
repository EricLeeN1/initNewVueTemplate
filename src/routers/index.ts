import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: '登录',
            keepAlive: true,
            requireAuth: true,
        },
        component: () => import('../views/Home/index.vue'),
    },
    {
        path: '/about',
        name: 'About',
        meta: {
            title: '登录',
            keepAlive: true,
            requireAuth: true,
        },
        component: () => import('../views/About/index.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
            keepAlive: true,
            requireAuth: false,
        },
        component: () => import('../views/Login/index.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
