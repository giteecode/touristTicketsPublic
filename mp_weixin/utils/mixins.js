const originPage = Page

const date = require('./date').default

Page = (options) => {
    const mixins = options.mixins
    // mixins 必须为数组
    if (Array.isArray(mixins)) {
        delete options.mixins
        // mixins 注入并执行相应逻辑
        merge(mixins, options)
    }
    // 释放原生 Page 函数
    originPage({
        onInput(event) {
            var name = event.currentTarget.dataset.name;
            var data = {};
            data[name] = event.detail
            this.setData(data);
        },
        logout() {
            wx.showModal({
                title: '温馨提示',
                content: '是否退出登录',
                success(r) {
                    if (r.confirm) {
                        const app = getApp();
                        app.logout();
                        wx.reLaunch({
                            url: '/pages/index/index',
                        });
                    }
                }
            });
        },
        onInputValue(event) {
            var name = event.currentTarget.dataset.name;
            var value = event.currentTarget.dataset.value;
            this.setDataObj(name, value);
        },
        onDate(event) {
            var dataset = event.currentTarget.dataset;
            var name = dataset.name;
            var data = {};
            data[name] = date(dataset.format, event.detail / 1000);
            this.setData(data);
        },
        goUrl(event) {
            var dataset = event.currentTarget.dataset;
            wx.navigateTo({
                url: dataset.url,
            })
        },
        goBack() {
            wx.navigateBack({
                delta: 1,
            });
        },
        setDataObj(name, value) {
            var data = {};
            data[name] = value
            this.setData(data);
        },
        goBack() {
            wx.navigateBack({
                delta: 1
            })
        },
        ...options,

    })
}
const originProperties = ['data', 'properties', 'options']
const originMethods = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

function merge(mixins, options) {
    mixins.forEach((mixin) => {
        if (Object.prototype.toString.call(mixin) !== '[object Object]') {
            throw new Error('mixin 类型必须为对象！')
        }
        // 遍历 mixin 里面的所有属性
        for (let [key, value] of Object.entries(mixin)) {
            if (originProperties.includes(key)) {
                // 内置对象属性混入
                options[key] = {...value, ...options[key]}
            } else if (originMethods.includes(key)) {
                // 内置方法属性混入，优先执行混入的部分
                const originFunc = options[key]
                options[key] = function (...args) {
                    value.call(this, ...args)
                    return originFunc && originFunc.call(this, ...args)
                }
            } else {
                // 自定义方法混入
                //options = {...mixin, ...options}

                const originFunc = options[key]
                options[key] = function (...args) {
                    value.call(this, ...args)
                    return originFunc && originFunc.call(this, ...args)
                }

            }
        }
    })
}
