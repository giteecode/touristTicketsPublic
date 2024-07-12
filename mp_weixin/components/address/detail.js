const { isObject } = require("../../utils/util");

// components/address/detail.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        map: {
            type: Object,
            optionalTypes: [String],
            value: "",
            observer(newVal, oldVal) {
                this.updateData(newVal);
            },
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        address: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        updateData(map) {
            var address = "";
            if (isObject(map)) {
                address = map.address;
            } else {
                try {
                    var c = JSON.parse(map);
                    address = c.address;
                } catch (e) {}
            }
            this.setData({
                address,
            });
        },
    },
});
