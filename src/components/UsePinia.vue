<template>
    <div>
        {{ userStore.name }}
        <button @click="updateName">更换名字</button>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const updateName = () => {
    userStore.updateName('Eric');
};
</script>

<style scoped></style>
