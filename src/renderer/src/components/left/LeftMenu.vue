<template>
    <div class="left">
        <el-menu active-text-color="var(--index_menu_active_txtcolor)" background-color="var(--index_menu_bgcolor)"
            class="el-menu-vertical-demo" :default-active="activeIndex" text-color="var(--index_menu_txtcolor)"
            @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
                <el-icon>
                    <document />
                </el-icon>
                <span>本地模型</span>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon>
                    <setting />
                </el-icon>
                <span>设置</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { ref } from "vue";
const activeIndex = ref("1")
function handleOpen() {

}

function handleClose() {

}
</script>

<style lang="scss" scoped>
.left {
    height: 100%;

    .el-menu-vertical-demo {
        height: 100%;
    }
}
</style>