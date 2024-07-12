// components/select/select.js
Component({
    relations: {
        "./option": {
            type: "child", // 关联的目标节点应为子节点
            linked: function (target) {
                // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
                //console.log(target);
                this.startSetColumns();
            },
            linkChanged: function (target) {
                // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
                //console.log(target);
                this.startSetColumns();
            },
            unlinked: function (target) {
                // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
                //console.log(target);
                this.startSetColumns();
            },
        },
    },
    /**
     * 组件的属性列表
     */
    properties: {
        value: {
            type: String,
            optionalTypes: [Number],
        },
        label: {
            type: String,
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        content: "请选择",
        show: false,
        columns: [],
        defaultIndex: 0,
    },
    /**
     * 组件的方法列表
     */
    methods: {
        _getAllLi: function () {
            // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
            var nodes = this.getRelationNodes("./option");
            // console.log(nodes)
            // for(var ci of nodes){
            //   console.log(ci.data)
            // }
            return nodes;
        },
        startSetColumns() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setColumns();
            }, 200);
        },

        setColumns() {
            var nodes = this._getAllLi();
            var columns = [];
            var defaultIndex = 0;
            var content = "请选择";
            for (var i in nodes) {
                var v = nodes[i].data;
                var ci = {
                    label: v.label,
                    value: v.value,
                    disabled: v.disabled,
                };
                columns.push(ci);
                if (ci.value == this.data.value) {
                    defaultIndex = i;
                    content = ci.label;
                }
            }
            this.setData({
                columns,
                defaultIndex,
                content,
            });
        },
        onChange(event) {
            const { picker, value, index } = event.detail;
            this.setData({
                //defaultIndex: index,
                content: value.label,
            });
            this.triggerEvent("change", value.value, {
                bubbles: true,
            });
        },
        onConfirm(event) {
            this.onChange(event);
            this.onClose();
        },
        showPopup() {
            this.setData({
                show: true,
            });
        },
        onClose() {
            this.setData({ show: false });
        },
    },
    ready: function () {
        //this.startSetColumns();
    },
});
