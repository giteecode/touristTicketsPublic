// components/address/index.js

const constants = require("../../utils/amap-key");
const amapFile = require("../../utils/amap-wx.130");
const utils = require("../../utils/util");
const geohash = require("../../utils/geohash");

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: String,
        show: {
            type: Boolean,
            value: false,
        },
        current: {
            type: Boolean,
            value: false,
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        keywords: "",
        tips: [],
    },
    location: "",
    ready() {
        geohash.getLocation("gcj02", (address) => {
            this.location = address.longitude + "," + address.latitude;

            if (this.data.current) {
                var key = constants.amapKey;
                var myAmapFun = new amapFile.AMapWX({ key: key });
                myAmapFun.getRegeo({
                    location: this.location,
                    success: (data) => {
                        //成功回调
                        var detail = data[0];
                        var arr = geohash.gcj02tobd09(address.longitude, address.latitude);
                        var val = {
                            lng: parseFloat(arr[0].toFixed(6)),
                            lat: parseFloat(arr[1].toFixed(6)),
                            zoom: 11,
                            title: "",
                            address: detail.name,
                            name: detail.name,
                        };
                        this.onEmit(val, val);
                    },
                    fail: (info) => {
                        //失败回调
                        console.log(info);
                    },
                });
            }
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onCancel(e) {
            this.triggerEvent("close", e.detail, {});
        },
        onSelectAddress(e) {
            var data = e.currentTarget.dataset;
            var index = data.index;
            var item = this.data.tips[index];

            var location = item.location.split(",");
            var detail = utils.extend(true, {}, item, { lng: location[0], lat: location[1] });
            var arr = geohash.gcj02tobd09(detail.lng, detail.lat);
            detail.lng = arr[0];
            detail.lat = arr[1];

            var val = {
                lng: detail.lng,
                lat: detail.lat,
                zoom: 11,
                title: "",
                address: detail.name,
            };
            this.onEmit(val, val);
        },

        onEmit(val, detail) {
            this.triggerEvent("input", JSON.stringify(val), {});
            this.triggerEvent("select", detail, {});
        },

        onChange(e) {
            this.setData({
                keywords: e.detail,
            });
            var keywords = e.detail;
            var key = constants.amapKey;
            var myAmapFun = new amapFile.AMapWX({ key: key });
            var that = this;
            myAmapFun.getInputtips({
                keywords: keywords,
                location: this.location,
                success: function (data) {
                    if (data && data.tips) {
                        var tips = data.tips.filter((s) => s.location.length > 0);
                        that.setData({
                            tips: tips,
                        });
                    }
                },
            });
        },
    },
});
