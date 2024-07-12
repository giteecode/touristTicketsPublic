import Vue from "vue";
import VueRouter from "vue-router";
import adminRoutes from "./admin-routes";
Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/admin/sy",
        hidden: true,
        meta: { title: "主页", checkLogin: true },
    },
    {
        path: "/index",
        redirect: "/login",
        hidden: true,
    },
    {
        path: "/404",
        component: () => import("@/views/error-page/404"),
        hidden: true,
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login"),
        hidden: true,
    },
    {
        path: "/admin",
        name: "admin",
        redirect: "/admin/sy",
        component: () => import("@/views/admin"),
        children: [
            {
                path: "sy",
                name: "AdminSy",
                component: () => import("@/views/admin/sy"),
                meta: { checkLogin: true, title: "欢迎页", affix: true },
            },
            {
                path: "mod",
                name: "adminMod",
                component: () => import("@/views/admin/mod"),
                meta: { checkLogin: true, title: "修改密码" },
            },
            {
                path: "total",
                name: "AdminTotal",
                component: () => import("@/views/total/total"),
                meta: { authLogin: true, title: "统计" },
                props: (route) => ({ src: route.query.src }),
            },
            ...adminRoutes,
        ],
    },
    { path: "*", redirect: "/404", hidden: true },
];

const router = new VueRouter({
    routes,
});

export default router;
