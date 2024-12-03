import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        name: 'John Doe',
        token: '',
    }),
    actions: {
        updateName(name: string) {
            this.name = name;
        },
    },
});
