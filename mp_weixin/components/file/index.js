// components/image/upload-images.js
const { uploadFile } = require("../../request/upload");
const { isArray, each } = require("../../utils/extend");
const utils = require("../../utils/util");

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: String,
    },
    /**
     * 组件的初始数据
     */
    data: {
        downloadText: "下载",
        downloadFile: "",
    },
    /**
     * 组件的方法列表
     */
    methods: {
        download(e) {
            wx.showLoading({
                title: "加载中...",
            });
            var file = this.data.value;
            var down = wx.downloadFile({
                url: utils.formatImageSrc(file),
                success: (res) => {
                    if (res.statusCode == 200) {
                        // 下载完成
                        this.setData({
                            downloadText: "下载完成",
                            downloadFile: "",
                        });
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath, //图片文件路径
                            success: function (data) {
                                wx.hideLoading(); //隐藏 loading 提示框
                                wx.showModal({
                                    title: "提示",
                                    content: "保存成功",
                                    modalType: false,
                                });
                            },
                            // 接口调用失败的回调函数
                            fail: function (err) {
                                if (
                                    err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
                                    err.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
                                    err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
                                ) {
                                    wx.showModal({
                                        title: "提示",
                                        content: "需要您授权保存相册",
                                        modalType: false,
                                        success: (modalSuccess) => {
                                            wx.openSetting({
                                                success(settingdata) {
                                                    console.log("settingdata", settingdata);
                                                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                                                        wx.showModal({
                                                            title: "提示",
                                                            content: "获取权限成功,再次点击图片即可保存",
                                                            modalType: false,
                                                        });
                                                    } else {
                                                        wx.showModal({
                                                            title: "提示",
                                                            content: "获取权限失败，将无法保存到相册哦~",
                                                            modalType: false,
                                                        });
                                                    }
                                                },
                                                fail(failData) {
                                                    console.log("failData", failData);
                                                },
                                                complete(finishData) {
                                                    console.log("finishData", finishData);
                                                },
                                            });
                                        },
                                    });
                                }
                            },
                            complete(res) {
                                wx.hideLoading(); //隐藏 loading 提示框
                            },
                        });
                    } else {
                        wx.hideLoading(); //隐藏 loading 提示框
                        wx.showToast({
                            title: "下载失败",
                            icon: "error",
                        });
                    }
                },
            });
            down.onProgressUpdate((progress, totalBytesWritten, totalBytesExpectedToWrite) => {
                this.setData({ downloadText: "已下载：" + progress + "%" });
            });
        },
        openDocument(e) {
            // wx.openDocument({
            //     filePath: this.data.downloadFile,
            // });
        },
    },
});
