import http from "@/utils/ajax/http";
import { findIndex, handlerKeyValue, remove } from "@/utils/utils";
import Vue from "vue";
import { extend } from "@/utils/extend";

const state = {
    status: 0,
    lists: [],
    objLists: {},
};

const mutations = {
    setLists(state, data) {
        state.lists = data;
        state.objLists = handlerKeyValue(data);
    },
    setStatus(state, data) {
        state.status = data;
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
    selectAll(
        content // 获取所有数据
    ) {
        return new Promise((resolve, reject) => {
            if (content.state.status == 0) {
                content.commit("setStatus", 1);
                http.get("/api/diqu/selectAll").then(
                    (res) => {
                        if (res.code == 0) {
                            content.commit("setLists", res.data);
                            content.commit("setStatus", 2);
                            resolve(res.data);
                        } else {
                            content.commit("setStatus", 0);
                        }
                    },
                    (err) => {
                        reject(err);
                        content.commit("setStatus", 0);
                    }
                );
            } else if (content.state.status == 1) {
                // 等待数据完成
                var callbackFunc = () => {
                    var status = content.state.status;
                    if (status == 1) {
                        setTimeout(callbackFunc, 20);
                    } else if (status == 2) {
                        resolve(content.state.lists);
                    } else {
                        reject(new Error("估计网络出错了"));
                    }
                };
                setTimeout(callbackFunc, 20);
            } else {
                resolve(content.state.lists);
            }
        });
    },
    findById(content, id) {
        return new Promise((resolve, reject) => {
            http.get("/api/diqu/findById", { id }).then((res) => {
                if (res.code == 0) {
                    resolve(res.data);
                } else {
                    reject(res.msg);
                }
            });
        });
    },
    filter(content, data) {
        return new Promise((resolve, reject) => {
            http.post("/api/diqu/filter", data)
                .json()
                .then(
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
    query(content, data) {
        // 分页查询数据
        return new Promise((resolve, reject) => {
            http.post("/api/diqu/selectPages", data)
                .json()
                .then(
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
        // 更新数据
        return new Promise((resolve, reject) => {
            http.post("/api/diqu/update", data)
                .json()
                .then(
                    (res) => {
                        if (res.code == 0) {
                            if (content.state.status == 0) {
                                content.dispatch("selectAll");
                            } else {
                                content.commit("update", res.data);
                            }
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
        // 插入数据
        return new Promise((resolve, reject) => {
            http.post("/api/diqu/insert", data)
                .json()
                .then(
                    (res) => {
                        if (res.code == 0) {
                            if (content.state.status == 0) {
                                content.dispatch("selectAll");
                            } else {
                                content.commit("insert", res.data);
                            }
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
        // 删除数据
        return new Promise((resolve, reject) => {
            http.post("/api/diqu/delete", data)
                .json()
                .then(
                    (res) => {
                        if (res.code == 0) {
                            if (content.state.status == 0) {
                                content.dispatch("selectAll");
                            } else {
                                content.commit("delete", data);
                            }
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
