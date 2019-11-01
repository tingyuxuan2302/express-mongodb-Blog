<template>
    <div id="app">
        <div id="container">
            <el-row class="tac" id="tab-nav">
                <el-col>
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-menu-item index="1">
                            <i class="el-icon-setting"></i>
                            <span slot="title">
                                <router-link to="/register">注册</router-link>
                            </span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-user-solid"></i>
                            <span slot="title">
                                <router-link to="/signIn">登陆</router-link>
                            </span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <i class="el-icon-football"></i>
                            <span slot="title">
                                <router-link to="/home">我的主页</router-link>
                            </span>
                        </el-menu-item>
                         <el-menu-item index="4">
                            <i class="el-icon-basketball"></i>
                            <span slot="title">
                                <router-link to="/home">发表文章</router-link>
                            </span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
            <div id="content">

                <router-view></router-view>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "app"
};
</script>
<style lang="less">
    @import './index.less';
</style>


