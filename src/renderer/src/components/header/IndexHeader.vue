<template>
    <div class="indexHeader">
        <el-row style="background-color: var(--index_menu_bgcolor);">
            <el-col :span="20">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                    background-color="var(--index_menu_bgcolor)" text-color="var(--index_menu_txtcolor)"
                    active-text-color="var(--index_menu_active_txtcolor)" @select="handleSelect">
                    <el-menu-item index="1">Processing Center</el-menu-item>
                    <el-menu-item index="3" disabled>Info</el-menu-item>
                    <el-menu-item index="4">Orders</el-menu-item>
                </el-menu>
            </el-col>
    
            <el-col :span="4">
                <div class="btns">
                    <el-icon @click="onToggeleWindow(0)">
                        <Minus />
                    </el-icon>
                    <el-icon @click="onToggeleWindow(1)">
                        <FullScreen />
                    </el-icon>
                    <el-icon>
                        <Close @click="onToggeleWindow(2)" />
                    </el-icon>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from "vue";
const activeIndex = ref("1")


function handleSelect() {

}

//切换window窗体状态
function onToggeleWindow(type) {
  window.api.toggleWindowType(type)
}
</script>

<style lang="scss" scoped>
.indexHeader {
    .el-menu-demo {
        border-bottom: 0px;
    }

    .btns {
        font-size: 26px;
        display: flex;
        justify-content: end;
        box-sizing: border-box;
        padding: 15px 12px;

        .el-icon {
            margin-left: 20px;
            cursor: pointer;
            font-weight: 600;
        }
    }
}
</style>