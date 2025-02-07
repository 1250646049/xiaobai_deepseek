<template>
    <div class="index">
        <!-- 中间区域 -->
        <el-container class="container">
            <el-header class="header">
                <!-- 头 -->
                <IndexHeader />
            </el-header>
            <el-container class="body">
                <el-aside class="aside">
                    <LeftMenu />
                </el-aside>
                <el-main class="main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import IndexHeader from '@renderer/components/header/IndexHeader.vue';
import LeftMenu from '@renderer/components/left/LeftMenu.vue';
</script>

<style lang="scss" scoped>
$header_height: 60px;

.index {
    height: 100vh;

    .container {
        height: 100%;

        .header {
            padding: 0;
            position: fixed;
            left: 0;
            right: 0;
            z-index: 9999;
            height: $header_height;
        }

        .aside {
            height: inherit;
            height: 100%;
            position: fixed;
            z-index: 9999;
            top: $header_height ;
            bottom: 0;
            left: 0;
            width: 200px;
        }


        .body {
            margin-top: $header_height;
            height: auto;

            .main {
                margin-left: 200px;
                background-color: var(--index_main_bgcolor);
                color: var(--index_main_txtcolor);
                padding: 0;
                overflow-y: scroll;

            }
        }
    }
}
</style>