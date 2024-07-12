// components/select/option.js
Component({
    relations: {
        "./select": {
            type: "parent", // 关联的目标节点应为父节点
            linked: function (target) {
                // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
                //console.log('option-linked',target)
            },
            linkChanged: function (target) {
                // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
                //console.log('option-linkChanged',target)
            },
            unlinked: function (target) {
                // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
                //console.log('option-unlinked',target)
            },
        },
    },
    /**
     * 组件的属性列表
     */
    properties: {
        label: String,
        value: {
            type: String,
            optionalTypes: [Number],
        },
        disabled: {
            type: Boolean,
            value: false,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {},
});
