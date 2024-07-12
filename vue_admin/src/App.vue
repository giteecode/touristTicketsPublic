<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                data: [],
            };
        },
    };
</script>

<style>
    html,
    body {
        height: 100%;
        width: 100%;
    }

    #app {
        width: 100%;
        height: 100%;
    }
</style>
