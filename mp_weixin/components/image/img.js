// components/image/img.js
const { formatImageSrc, isArray } = require("../../utils/util");

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        src: String,
        pb: {
            type: [Number, String],
            value: 80,
        },
    },
    observers: {
        src: function (src) {
            // 在 numberA 或者 numberB 被设置时，执行这个函数
            this.updateDataSrc(src);
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        imgSrc: "",
        width: 0,
        height: 0,
    },
    lifetimes: {
        attached: function () {
            this.updateDataSrc(this.data.src);
        },
    },

    ready() {
        this.updateDataSrc(this.data.src);
    },
    /**
     * 组件的方法列表
     */
    methods: {
        updateDataSrc(src) {
            var images;
            if (isArray(src)) {
                images = src[0];
            } else {
                images = src.split(",")[0];
            }
            if (!images) {
                images = "";
            }
            this.setData({
                imgSrc: formatImageSrc(images),
            });
        },
    },
});
