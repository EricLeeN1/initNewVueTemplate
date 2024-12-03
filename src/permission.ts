import router from '@/routers';
// 通过 storeToRefs 拿到响应式数据
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { ROUTE_WHITE_LIST } from '@/constants/enums';

router.beforeEach((to: any, _from: any, next: any) => {
    const store = useUserStore();
    const { token } = storeToRefs(store);
    const { name } = to;
    const isInWhiteList = ROUTE_WHITE_LIST.includes(name);
    token.value || isInWhiteList ? next() : next({ name: 'Login' });
});
