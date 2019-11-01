<template>
    <div class="register-container">
        <h3>请小主注册您嘞</h3>
        <div class="box">
            <div>
                <label>用户名</label>
                <el-input v-model="userName" placeholder="用户名"></el-input>
            </div>
            <div>
                <label>密码</label>
                <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
            </div>
            <div>
                <label>确认密码</label>
                <el-input placeholder="请再次输入密码" v-model="passwordSure" show-password></el-input>
            </div>
            <div>
                <label>性别</label>
                <el-select v-model="sexVal" placeholder="请选择">
                    <el-option
                    v-for="item in sex"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <label>头像</label>
                <input type="file">
            </div>
            <el-button type="primary" class="register-btn">注册了呀</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sex: [
                {
                    value: 'm',
                    label: '男'
                },
                {
                    value: 'f',
                    label: '女'
                },
                {
                    value: 'x',
                    label: '不男不女'
                }
            ],
            userName: '',
            password: '',
            passwordSure: '',
            sexVal: 'x',

        }
    }
};
</script>
<style lang="less">
@import url("./register.less");
</style>


