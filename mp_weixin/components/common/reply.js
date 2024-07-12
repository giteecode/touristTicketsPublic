const { extend } = require("../../utils/util");
const DB = require("../../request/db");

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pinglunid: {
            type: String,
            optionalTypes: [Number],
            observer(val) {
                this.loadInfo();
                this.loadReply();
            },
        },
        user: String,
        username: "",
        nickname: String,
        headimg: String,
    },
    /**
     * 组件的初始数据
     */
    data: {
        isHidden: true,
        replyList: [],
        content: "",
    },
    ready() {
        this.loadInfo();
        this.loadReply();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onInputValue(event) {
            var name = event.currentTarget.dataset.name;
            var value = event.currentTarget.dataset.value;
            var data = {};
            data[name] = value;
            this.setData(data);
        },
        loadReply() {
            var map = this.data;
            DB.name("pinglunhuifu")
                .alias("p")
                .field(`p.*,u.id as userid,u.${map.nickname} as nickname,u.${map.headimg} headimgurl`)
                .joinLeft(`${map.user} as u`, `u.${map.username}=p.pinglunren`)
                .where("p.pinglunid", map.pinglunid)
                .order("p.id")
                .select()
                .then((res) => {
                    this.setData({
                        replyList: res.data,
                    });
                });
        },
        loadInfo() {
            const st = require("../../request/module/pinglunhuifu");
            st.loadInfo(this.data.pinglunid).then((res) => {
                this.setData(res);
            });
        },
        onInputContent(e) {
            this.setData({
                content: e.detail,
            });
        },
        submitReply() {
            const st = require("../../request/module/pinglunhuifu");
            var form = extend(true, {}, this.data.form);
            form.huifuneirong = this.data.content;
            // 回复内容
            st.insert(form).then((res) => {
                if (res.code == 0) {
                    this.loadReply();
                    this.setData({
                        //replyList:this.data.replyList,
                        content: "",
                        isHidden: true,
                    });
                } else {
                    wx.showModal({
                        title: "温馨提示：",
                        content: res.msg,
                    });
                }
            });
        },
    },
});
