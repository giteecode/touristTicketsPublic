import http from "@/utils/ajax/http";
import api from "@/api";
import cache from "@/utils/cache";
import router from "@/router";
const state = {
    token: cache.getCache("token", ""),
    session: cache.getCache("session", {}),
};

const mutations = {
    setSession(state, data) {
        state.session = data;
        cache.setCache("session", data, 7200);
    },
    setToken(state, token) {
        state.token = token;
        cache.setCache("token", token, 7200);
    },
    deleteToken(state) {
        state.token = "";
        state.session = {};
        cache.removeCache("session");
        cache.removeCache("token");
    },
};

const actions = {
    login({ commit }, data) {
        return new Promise((resolve, reject) => {
            http.post(api.user.login, data)
                .then((res) => {
                    if (res.code == api.code.OK) {
                        commit("setSession", res.data.session);
                        commit("setToken", res.data.token);
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            http.post("/api/user/logout").then((res) => {
                if (res.code == 0) {
                    commit("deleteToken");
                }
                resolve(res);
            });

            router.push();
        });
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
