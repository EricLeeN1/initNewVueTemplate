<template>
    <div>
        <h1>测试 vueUse 的鼠标坐标</h1>
        <h3>Mouse: {{ x }} x {{ y }}</h3>
    </div>
</template>

<script setup lang="ts">
import { useMouse } from '@vueuse/core';
const { x, y } = useMouse();
</script>

<style scoped></style>
