<template>
    <div class="wxuser-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="title"> 添加微信用户</span>
            </div>
            <div class="form-database-form">
                <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                    <el-form-item label="昵称" prop="nickName"> <el-input type="text" placeholder="输入昵称" style="width: 250px" v-model="form.nickName" /> </el-form-item>

                    <el-form-item label="头像" prop="avatarUrl"> <e-upload-image v-model="form.avatarUrl"></e-upload-image> </el-form-item>

                    <el-form-item label="性别" prop="gender" :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}]">
                        <el-input type="number" placeholder="输入性别" style="width: 250px" v-model.number="form.gender" />
                    </el-form-item>

                    <el-form-item label="国家" prop="country"> <el-input type="text" placeholder="输入国家" style="width: 250px" v-model="form.country" /> </el-form-item>

                    <el-form-item label="省份" prop="province"> <el-input type="text" placeholder="输入省份" style="width: 250px" v-model="form.province" /> </el-form-item>

                    <el-form-item label="城市" prop="city"> <el-input type="text" placeholder="输入城市" style="width: 250px" v-model="form.city" /> </el-form-item>

                    <el-form-item v-if="btnText">
                        <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
    .wxuser-add {
    }
</style>
<script>
    import api from "@/api";
    import rule from "@/utils/rule";
    import { extend } from "@/utils/extend";
    import formUtil from "./form";

    export default {
        name: "wxuser-add",
        data() {
            return {
                rule,
                loading: false,
                form: {},
            };
        },
        watch: {},
        props: {
            isRead: {
                type: Boolean,
                default: true,
            },
            btnText: {
                type: String,
                default: "提交",
            },
        },

        computed: {},
        methods: {
            submit() {
                this.$refs.formModel
                    .validate()
                    .then((res) => {
                        if (this.loading) return;
                        this.loading = true;
                        var form = this.form;

                        this.$store
                            .dispatch("wxuser/insert", form)
                            .then((res) => {
                                this.loading = false;
                                if (res.code == 0) {
                                    this.$message.success("添加成功");
                                    this.loadInfo();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            })
                            .catch((err) => {
                                this.loading = false;
                                this.$message.error(err.message);
                            });
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            },
            loadInfo() {
                if (this.loading) return;
                var form = this.form;
                this.form = formUtil.createForm();

                // 获取模块得数据
            },
        },
        created() {
            this.loadInfo();
        },
        mounted() {},
        destroyed() {},
    };
</script>
