// components/payment/payment.js
const { httpGet } = require("../../request/request");

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        biao: {
            type: String,
        },
        biaoid: {
            type: String,
            optionalTypes: [String, Number],
        },
        btnText: {
            type: String,
            value: "立即支付",
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        loading: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        payment() {
            this.setData({
                loading: true,
            });
            httpGet("/payment", {
                biao: this.data.biao,
                id: this.data.biaoid,
            })
                .then((res) => {
                    this.setData({
                        loading: false,
                    });
                    wx.showModal({
                        content: "支付成功",
                    });

                    this.triggerEvent("success", {}, false);
                    //this.loadDetail();
                    // wx.reLaunch({
                    //   url: 'pages/index/index',
                    // })
                })
                .catch((err) => {
                    this.setData({
                        loading: false,
                    });
                    console.log(err);
                });
        },
    },
});
