<template>
    <div class="v-admin-sy">
        <el-row :gutter="50">
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ wxuserList.length }}</div>
                    <div class="text">微信用户</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ adminsList.length }}</div>
                    <div class="text">管理员</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ yonghuList.length }}</div>
                    <div class="text">用户</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ jingdianxinxiList.length }}</div>
                    <div class="text">景点信息</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ diquList.length }}</div>
                    <div class="text">地区</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ menpiaoList.length }}</div>
                    <div class="text">门票</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ goupiaoList.length }}</div>
                    <div class="text">购票</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ meishixinxiList.length }}</div>
                    <div class="text">美食信息</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ meishifenleiList.length }}</div>
                    <div class="text">美食分类</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ lunbotuList.length }}</div>
                    <div class="text">轮播图</div>
                </div>
            </el-col>
            <el-col :span="6" style="margin-bottom: 50px">
                <div class="msg-box">
                    <div class="number">{{ pinglunList.length }}</div>
                    <div class="text">评论</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style type="text/scss" lang="scss">
    .v-admin-sy {
        padding: 0 20px;
        .msg-box {
            padding: 10px;
            background: #ffffff;
            text-align: center;
            .number {
                padding: 10px 0;
                font-size: 36px;
                font-weight: bold;
                color: #900;
            }

            .text {
                font-size: 16px;
                padding-bottom: 10px;
            }
        }
    }
</style>
<script>
    import store from "@/store";
    const setting = require("@/setting");
    export default {
        name: "v-admin-sy",
        data() {
            return {
                setting,
            };
        },
        watch: {},
        computed: {
            wxuserList() {
                return store.state.wxuser.lists;
            },
            adminsList() {
                return store.state.admins.lists;
            },
            yonghuList() {
                return store.state.yonghu.lists;
            },
            jingdianxinxiList() {
                return store.state.jingdianxinxi.lists;
            },
            diquList() {
                return store.state.diqu.lists;
            },
            menpiaoList() {
                return store.state.menpiao.lists;
            },
            goupiaoList() {
                return store.state.goupiao.lists;
            },
            meishixinxiList() {
                return store.state.meishixinxi.lists;
            },
            meishifenleiList() {
                return store.state.meishifenlei.lists;
            },
            lunbotuList() {
                return store.state.lunbotu.lists;
            },
            pinglunList() {
                return store.state.pinglun.lists;
            },
        },
        methods: {},
        created() {
            store.dispatch("wxuser/selectAll");

            store.dispatch("admins/selectAll");

            store.dispatch("yonghu/selectAll");

            store.dispatch("jingdianxinxi/selectAll");

            store.dispatch("diqu/selectAll");

            store.dispatch("menpiao/selectAll");

            store.dispatch("goupiao/selectAll");

            store.dispatch("meishixinxi/selectAll");

            store.dispatch("meishifenlei/selectAll");

            store.dispatch("lunbotu/selectAll");

            store.dispatch("pinglun/selectAll");
        },
        mounted() {},
        destroyed() {},
    };
</script>
