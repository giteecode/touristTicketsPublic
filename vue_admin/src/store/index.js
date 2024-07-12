import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const modulesFiles = require.context("./modules", true, /\.js$/); // 加载module 目录下的所有模块、访问以模块下的文件为开始

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
}, {});

const state = {};
const mutations = {};
const actions = {};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules,
});
