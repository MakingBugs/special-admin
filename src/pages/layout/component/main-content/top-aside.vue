<template>
    <aside class="aside__top">
        <span
            class="iconfont icon-nav toggleNavCollapse"
            :class="{active:isSidebarNavCollapse}"
            @click="toggleNavCollapse"
        >
        </span>
        <el-breadcrumb separator="/">
            <transition-group name="breadcrumb">
                <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
                <template v-for="(route,i) in crumbList" v-if="route.name!='home'">
                    <el-breadcrumb-item
                        :key="route.name"
                        :to="{name:route.name}"
                        v-if="route.name!='home' && route.meta.name!='首页'"
                        :class="{'is-last-link':i==crumbList.length-1}"
                    >
                        {{route.meta.name}}
                    </el-breadcrumb-item>
                </template>
            </transition-group>
        </el-breadcrumb>
        <div class="aside__top--right">
            <div class="user-msg">
                <!-- <img class="user-img" :src="avatar" alt=""> //头像-->
                <!-- <span class="user-name">{{account}}</span> -->
                <!-- <span class="user-name">{{userId}}</span> -->
                <el-dropdown trigger="click" placement="top" @command="handleChange">
                    <span class="el-dropdown-link">
                        {{userAccount.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item command='modifyPassword'>修改密码</el-dropdown-item> -->
                        <el-dropdown-item command='loginOut'>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- <div class="quit-system" @click="loginOut">
                <span class="iconfont icon-quit"></span>
            </div> -->
        </div>
        <el-dialog
            title="修改密码"
            :visible.sync="visible"
            width="40%"
            :modal-append-to-body="false">
            <el-form label-width="100px">
                <el-form-item label="原密码">
                <el-input v-model="userInfo.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                <el-input v-model="userInfo.newPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" autocomplete="off">
                <el-input></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </span>
        </el-dialog>
    </aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            userInfo: {
                userId:this.userId,
                oldPassword: '',
                newPassword: '',
            },
            visible: false,
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse', 'crumbList']),
        ...mapState(['userAccount'])
    },
    methods: {
        
        toggleNavCollapse() {
            this.$store.commit('toggleNavCollapse')
        },
        // loginOut() {
        //     this.$store.commit('LOGIN_OUT')
        //     /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
        //     window.location.reload()
        // },
        handleChange(command) {
            if(command == 'loginOut'){
                this.$store.commit('LOGIN_OUT')
                window.location.reload()
             }else if(command == 'modifyPassword'){
                this.visible = true
            }
        },
        //保存密码
        update() {
            this.$message({
                type: 'success',
                message: '修改密码成功，请重新登录！'
            });
            this.$store.commit('LOGIN_OUT')
            /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
            window.location.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
.aside__top {
    border-bottom: 1px solid #e5e5e5;
    height: 50px;
    line-height: 50px;
    position: fixed;
    left: 200px;
    top: 0;
    right: 0;
    background: #fff;
    z-index: 1000;
    transition: left 0.25s;
    .toggleNavCollapse {
        display: inline-block;
        margin-left: 8px;
        padding: 0 10px;
        font-size: 26px;
        vertical-align: middle;
        color: #333;
        cursor: pointer;
        transition: all 0.5s;
        &.active {
            transform: rotate(90deg);
        }
    }

    .aside__top--right {
        position: absolute;
        right: 10px;
        top: -1px;
        bottom: 0px;
        > div {
            position: relative;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            margin-left: 10px;
            padding: 0 15px;
            cursor: pointer;
            &:hover::after {
                transform-origin: 0 0;
                transform: scaleX(1);
            }
            &:first-child:before {
                border: none;
            }
            &::after {
                content: '';
                position: absolute;
                left: 15px;
                right: 15px;
                bottom: 0;
                // width: 100%;
                height: 2px;
                background: #2576db;
                transform: scaleX(0);
                transform-origin: right 0;
                transition: transform 0.5s;
            }
            &::before {
                content: '';
                position: absolute;
                height: 20px;
                top: 50%;
                left: -8px;
                margin-top: -10px;
                border-left: 1px solid #ccc;
            }
            &.email {
                i {
                    position: absolute;
                    left: 18px;
                    top: -12px;
                    border-radius: 20px;
                    background: red;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    line-height: 1.5;
                    min-width: 20px;
                    min-height: 20px;
                }
            }
            &.user-msg {
                // .user-img {
                //     width: 34px;
                //     height: 34px;
                //     border-radius: 50%;
                //     vertical-align: middle;
                // }
                .user-name {
                    color: #758eb5;
                    padding: 0 4px;
                }
            }
            .iconfont {
                position: relative;
                font-size: 24px;
                color: #758eb5;
            }
        }
    }
}
.breadcrumb-enter,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
    transition: all 0.6s;
}

.breadcrumb-leave-active {
    position: absolute;
}
</style>
