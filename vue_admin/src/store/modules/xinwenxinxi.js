import http from "@/utils/ajax/http";
import { findIndex, handlerKeyValue, remove } from "@/utils/utils";
import Vue from "vue";
import { extend } from "@/utils/extend";

const state = {
    lists: [],
    objLists: {},
};

const mutations = {
    setLists(state, data) {
        state.lists = data;
        state.objLists = handlerKeyValue(data);
    },
    push(state, data) {
        state.lists.push(data);
        Vue.set(state.objLists, data.id, data);
    },
    insert(state, data) {
        // 从头部插入数据
        state.lists.unshift(data);
        Vue.set(state.objLists, data.id, data);
    },
    update(state, data) {
        if (!data.id || !state.objLists[data.id]) return;
        extend(state.objLists[data.id], data); // 合并数据
    },
    replace(state, data) {
        // 判断是否存在，存在则插入，不存在则
        if (!state.objLists[data.id]) {
            // 不存在，则插入数据
            state.lists.unshift(data);
            Vue.set(state.objLists, data.id, data);
        } else {
            extend(state.objLists[data.id], data); // 合并数据
        }
    },
    delete(state, listIds) {
        for (var i = 0; i < listIds.length; i++) {
            remove(state.objLists, listIds[i]);
            var index = findIndex(state.lists, (r) => r.id == listIds[i]);
            if (index !== false) {
                remove(state.lists, index);
            }
        }
    },
};

const actions = {
    selectAll(content) {
        return new Promise((resolve, reject) => {
            if (content.state.lists.length == 0) {
                http.get("/api/xinwenxinxi/selectAll").then(
                    (res) => {
                        content.commit("setLists", res.data);
                        resolve(res.data);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            } else {
                resolve(content.state.lists);
            }
        });
    },
    query(content, data) {
        return new Promise((resolve, reject) => {
            http.post("/api/xinwenxinxi/selectPages", JSON.stringify(data)).then(
                (res) => {
                    if (res.code == 0) {
                        resolve(res);
                    } else {
                        reject(res.msg);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    update(content, data) {
        return new Promise((resolve, reject) => {
            http.post("/api/xinwenxinxi/update", JSON.stringify(data)).then(
                (res) => {
                    if (res.code == 0) {
                        content.commit("update", res.data);
                    }
                    resolve(res);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    insert(content, data) {
        return new Promise((resolve, reject) => {
            http.post("/api/xinwenxinxi/insert", JSON.stringify(data)).then(
                (res) => {
                    if (res.code == 0) {
                        content.commit("insert", res.data);
                    }
                    resolve(res);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
    delete(content, data) {
        return new Promise((resolve, reject) => {
            http.post("/api/xinwenxinxi/delete", JSON.stringify(data)).then(
                (res) => {
                    if (res.code == 0) {
                        content.commit("delete", data);
                    }
                    resolve(res);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
