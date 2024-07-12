// app.js
import { httpGet } from "./request/request";

require("./utils/mixins");

App({
    onLaunch() {
        this.globalData.token = wx.getStorageSync("token");
        this.globalData.userInfo = wx.getStorageSync("userInfo");
        this.totakLogin();
    },
    include(path) {
        return require("." + path);
    },
    isLogin() {
        return this.globalData.token != "";
    },
    session(name) {
        if (this.globalData.userInfo == null) {
            return null;
        }
        return this.globalData.userInfo[name];
    },
    user(name) {
        return this.globalData.user[name];
    },
    totakLogin() {
        if (this.globalData.token) {
            // 获取信息,并检测是否登录
            httpGet("/wxuser/isLogin")
                .then((res) => {
                    if (res.code == 0) {
                        this.globalData.user = res.data;
                    } else {
                        this.globalData.token = "";
                        this.globalData.userInfo = null;
                        this.globalData.user = {};
                        wx.removeStorage({
                            key: "token",
                        });
                        wx.removeStorage({
                            key: "userInfo",
                        });
                        wx.removeStorage({
                            key: "user",
                        });
                    }
                })
                .catch((err) => {
                    wx.removeStorage({
                        key: "token",
                    });
                    wx.removeStorage({
                        key: "userInfo",
                    });
                    wx.removeStorage({
                        key: "user",
                    });
                });
        }
    },
    logout() {
        wx.removeStorage({
            key: "token",
        });
        wx.removeStorage({
            key: "userInfo",
        });
        wx.removeStorage({
            key: "user",
        });
        this.globalData.userInfo = null;
        this.globalData.token = null;
        this.globalData.user = {};
    },
    getUser(id) {
        return new Promise((resove, reject) => {
            if (this.globalData.userList[id]) {
                resove(this.globalData.userList[id]);
            } else {
                const wxuser = require("./request/module/wxuser");
                wxuser
                    .dispatch("selectAll")
                    .then((res) => {
                        this.globalData.userList = wxuser.state.objLists;
                        resove(this.globalData.userList[id]);
                    })
                    .catch((err) => [reject(err)]);
            }
        });
    },

    globalData: {
        userInfo: null,
        token: null,
        userList: {},
        user: {},
    },
});
