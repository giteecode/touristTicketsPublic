// components/user/avatar.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        userid: {
            type: String,
            optionalTypes: [Number],
            observer(newVal) {
                this.loadUserInfo(newVal);
            },
        },
    },
    ready() {
        this.loadUserInfo(this.data.userid);
    },
    /**
     * 组件的初始数据
     */
    data: {
        user: {},
    },
    /**
     * 组件的方法列表
     */
    methods: {
        loadUserInfo(id) {
            app.getUser(id).then((res) => {
                this.setData({
                    user: res,
                });
            });
        },
    },
});
