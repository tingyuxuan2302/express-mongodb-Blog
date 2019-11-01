<template>
    <div class="sign-container">
        <h3>请小主登陆您嘞</h3>
        <div class="box">
            <div>
                <label>用户名</label>
                <el-input v-model="userName" placeholder="用户名"></el-input>
            </div>
            <div>
                <label>密码</label>
                <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
            </div>
            <el-button type="primary" class="sign-btn">登陆咯</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

            userName: '',
            password: '',

        }
    }
};
</script>
<style lang="less">
@import url("./signIn.less");
</style>
