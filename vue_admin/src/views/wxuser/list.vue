<template>
    <div class="v-list" v-loading="loading" element-loading-text="加载中">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="title"> 微信用户列表 </span>
            </div>
            <!-- 搜索 -->
            <div class="form-search">
                <el-form @submit.prevent.stop :inline="true" size="mini">
                    <el-form-item label="昵称">
                        <el-input v-model="search.nickName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table border :data="list" style="width: 100%" @sort-change="sortChange" highlight-current-row @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column
                ><!-- 批量选择 -->

                <el-table-column prop="nickName" label="昵称" width="130">
                    <template slot-scope="{row}"> {{ row.nickName }} </template>
                </el-table-column>
                <el-table-column prop="avatarUrl" label="头像" width="100">
                    <template slot-scope="{row}"> <e-img :src="row.avatarUrl" style="max-width: 120px" /> </template>
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="80">
                    <template slot-scope="{row}"> {{ row.gender }} </template>
                </el-table-column>
                <el-table-column prop="country" label="国家" width="130">
                    <template slot-scope="{row}"> {{ row.country }} </template>
                </el-table-column>
                <el-table-column prop="province" label="省份" width="130">
                    <template slot-scope="{row}"> {{ row.province }} </template>
                </el-table-column>
                <el-table-column prop="city" label="城市" width="130">
                    <template slot-scope="{row}"> {{ row.city }} </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top">
                                <el-button icon="el-icon-edit" @click="$goto({path:'/admin/wxuserupdt',query:{id:row.id } })" type="warning" size="mini"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button icon="el-icon-delete" type="danger" size="mini" @click="deleteItem(row)"> </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <div class="batch-list">
                <el-button type="danger" :disabled="multipleSelection.length==0" @click="batchDeleteItems">批量删除</el-button>
            </div>

            <div class="e-pages" style="margin-top: 10px; text-align: center">
                <el-pagination
                    @current-change="loadList"
                    :current-page="page"
                    :page-size="pagesize"
                    @size-change="sizeChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                >
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
    import api from "@/api";
    import { remove, checkIssh, findIndex } from "@/utils/utils";
    import { extend } from "@/utils/extend";
    import objectDiff from "objectdiff";

    /**
     * 后台列表页面
     */
    export default {
        data() {
            return {
                loading: false,
                list: [],
                search: {
                    orderby: "id",
                    sort: "desc",
                    nickName: "",
                },
                total: {},
                page: 1, // 当前页
                pagesize: 12, // 页大小
                totalCount: 0, // 总行数
                multipleSelection: [],
                //xinwenfenleiList: [],
            };
        },
        watch: {},
        computed: {},
        methods: {
            searchSubmit() {
                this.loadList(1);
            },
            selectTableChange(vals) {
                this.multipleSelection = vals;
            },
            sortChange(e) {
                console.log(e);
                if (e.order == null) {
                    this.search.orderby = "id";
                    this.search.sort = "desc";
                } else {
                    this.search.orderby = e.prop;
                    this.search.sort = e.order == "ascending" ? "asc" : "desc";
                }
                this.loadList(1);
            },
            checkIssh,
            sizeChange(e) {
                this.pagesize = e;
                this.loadList(1);
            },
            loadList(page) {
                // 防止重新点加载列表
                if (this.loading) return;
                this.loading = true;
                this.page = page;
                // 筛选条件
                var filter = extend(true, {}, this.search, { page: page + "", pagesize: this.pagesize + "" });
                var diff = objectDiff.diff(filter, this.$route.query);
                if (diff.changed != "equal") {
                    // 筛选的条件不一致则更新链接
                    this.$router.push({
                        // 更新query
                        path: this.$route.path,
                        query: filter,
                    });
                }

                this.$store
                    .dispatch("wxuser/query", filter)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            var data = res.data;
                            this.list = data.lists.records;
                            this.totalCount = data.lists.total;
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err.message);
                    });
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 删除选中行数据
            batchDeleteItems() {
                this.deleteItems(this.multipleSelection);
            },
            // 删除某行方法
            deleteItem(row) {
                this.deleteItems([row]);
            },
            deleteItems(items) {
                this.$confirm("确定删除数据？此操作不可恢复", "警告", {
                    type: "error",
                }).then(() => {
                    this.loading = true;
                    var ids = items.map((element) => {
                        return element.id;
                    });
                    this.$store.dispatch("wxuser/delete", ids).then((res) => {
                        this.loading = false;
                        if (res.code != api.code.OK) {
                            this.$message.error(res.msg);
                        } else {
                            for (var i = 0; i < ids.length; i++) {
                                var ci = ids[i];
                                var index = findIndex(this.list, (v) => v.id == ci);
                                remove(this.list, index);
                                this.totalCount--;
                            }
                            if (this.list.length == 0) {
                                this.loadList(this.page); // 没数据了重新加载数据
                            }
                            this.$message.success("删除成功");
                        }
                    });
                });
            },
        },
        beforeRouteUpdate(to, form, next) {
            extend(this.search, to.query);
            this.loadList(1);
            next();
        },
        created() {
            var search = extend(this.search, this.$route.query);
            if (search.page) {
                this.page = Math.floor(this.$route.query.page);
                delete search.page;
            }
            if (search.pagesize) {
                this.pagesize = Math.floor(this.$route.query.pagesize);
                delete search.pagesize;
            }

            this.loadList(1);
        },
        mounted() {},
        destroyed() {},
    };
</script>
