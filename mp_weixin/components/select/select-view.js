const { inArray, isArray } = require("../../utils/util");

// components/select/select-view.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        module: String,
        value: {
            type: String,
            optionalTypes: [Number],
        },
        select: String,
        show: String,
    },
    observers: {
        "module,value,select,show": function () {
            this.getValue();
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        content: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getValue() {
            this.setData({
                content: "",
            });
            var content = [];
            if (this.data.value) {
                var val;
                if (isArray(this.data.value)) {
                    val = this.data.value;
                } else {
                    val = "" + this.data.value;
                    val = val
                        .split(",")
                        .filter((s) => s)
                        .map((s) => parseInt(s));
                }

                var store = require("../../request/module/" + this.data.module);
                store.dispatch("selectAll").then((lists) => {
                    for (var ci of lists) {
                        if (inArray(parseInt(ci[this.data.select]), val)) {
                            content.push(ci[this.data.show]);
                        }
                    }
                    this.setData({
                        content: content.join(" , "),
                    });
                });
            }
        },
    },
    attached() {
        this.getValue();
    },
});
