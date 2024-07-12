// components/upload/video.js
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
        fileList: [],
    },
    ready() {
        this.setValue(this.data.value);
    },
    /**
     * 组件的方法列表
     */
    methods: {
        setValue(val) {
            var images = val
                .split(",")
                .filter((s) => s)
                .map((s) => {
                    return {
                        url: utils.formatImageSrc(s),
                        oUrl: s,
                    };
                });
            console.log(images);
            this.setData({
                fileList: images,
            });
        },
        updateData() {
            var url = this.data.fileList.map((o) => o.oUrl);
            this.triggerEvent("input", url.join(","), {});
        },
        afterRead(event) {
            const { file } = event.detail;
            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            if (isArray(file)) {
                each(file, (i, o) => {
                    this.uploadFile(o);
                });
            } else {
                this.uploadFile(file);
            }
        },
        uploadFile(file) {
            uploadFile(file)
                .then((res) => {
                    if (res.code == 0) {
                        const { fileList = [] } = this.data;
                        fileList.push({ ...file, url: utils.formatImageSrc(res.data), oUrl: res.data });
                        this.setData({ fileList });
                        this.updateData();
                    }
                })
                .catch((err) => {
                    wx.showToast({
                        title: "上传失败" + file.name,
                    });
                });
        },
    },
});
