import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "@/router/permission.js";
import ElementUI from "element-ui";
import UtilsAjax from "@/utils/ajax";
import Components from "./components";
import "@/styles.scss";

Vue.config.productionTip = false;

Vue.use(UtilsAjax);
Vue.use(ElementUI);
Vue.use(Components);

new Vue({
    render: (h) => h(App),
    router,
    store,
}).$mount("#app");
