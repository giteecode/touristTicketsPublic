<template>
    <div style="width: 120px" class="e-wxuser" v-if="info.id">
        <div class="image">
            <e-img-box :src="info.avatarUrl" pb="100" />
        </div>
        <div class="text">{{ info.nickName }}</div>
    </div>
</template>

<script>
    import DB from "@/utils/db";

    export default {
        name: "e-wxuser",
        data() {
            return {
                info: {},
            };
        },
        props: {
            id: [String, Number],
        },
        watch: {
            id() {
                this.loadInfo();
            },
        },
        methods: {
            loadInfo() {
                DB.name("wxuser")
                    .where("id", this.id)
                    .find()
                    .then((res) => {
                        this.info = res.data;
                    });
            },
        },
        created() {
            this.loadInfo();
        },
    };
</script>

<style scoped type="text/scss" lang="scss">
    .e-wxuser {
        display: flex;
        .image {
            width: 60px;
            height: 60px;
            flex-grow: 0;
        }
        .text {
            flex-grow: 1;
        }
    }
</style>
