<template>
    <div class="login-container">
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <h3 class="title">后台管理系统</h3>
            <!-- <el-form-item>
                v-if="process.env.NODE_ENV==='development'"
                <span class="svg-container svg-container_login">
                    <svg-icon icon-class="el-icon-link" />
                </span>
                <el-input name="ip" type="text" v-model="ip" placeholder="开发ip地址" />
            </el-form-item> -->
            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input name="password" :type="pwdType" @keyup.enter.native="login" v-model="loginForm.password" autoComplete="on"
                placeholder="请输入密码"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="login">
                登录
                </el-button>
            </el-form-item>
            <!-- <div class="tips">用户为admin的时候，能够看到所有的权限列表，其余账号只能看到部分</div> -->
        </el-form>
    </div>
</template>

<script>
import { login } from '@/api/common'
export default {
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('密码不能小于5位'))
            } else {
                callback()
            }
        }
        return {
            ip:'',
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{required: true, trigger: 'blur',message: '登录名不能为空'}],//,validator: validateUsername
                password: [{ required: true, trigger: 'blur',message: '密码不能为空'}]//, validator: validatePass 
            },
            loading: false,
            pwdType: 'password'
        }
    },
    created() {
    //    console.log(process.env.VUE_APP_HOST)
    //    process.env.VUE_APP_HOST = 'http://10.21.241.68:7022'
    },
    methods: {
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        login() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    login(this.loginForm).then(res=>{
                        let data = res;
                        this.$store.commit('LOGIN_IN', data)
                        // this.$store.commit('LOGIN_IN', data.uid)
                        // this.$store.commit('SET_ACCOUNT', data.username)
                        // this.$store.commit('SET_USERID', data.uid);
                        this.$router.replace('/')
                    })
                }
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 90%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
        input::-webkit-input-placeholder {
            color: #666;
        }
        input::-moz-input-placeholder {
            color: #666;
        }
        input::-ms-input-placeholder {
            color: #666;
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 520px;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;       
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    /* .fontcontainer{
        color:#889aa4;
        padding-left:10px;
    } */
}
</style>
