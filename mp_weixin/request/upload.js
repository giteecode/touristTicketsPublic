const config = require("../utils/constants");

// 上传文件到服务器中，返回 Promise 结构
export const uploadFile = (file) => {
    var authorization = getApp().globalData.token;
    return new Promise((r, e) => {
        wx.uploadFile({
            url: config.host + "/user/upload_re",
            filePath: file.url,
            name: "fujian",
            header: {
                Authorization: authorization,
            },
            //formData: { user: 'test' },
            success(res) {
                // 上传完成需要更新 fileList
                if (res.statusCode == 200) {
                    r(JSON.parse(res.data));
                } else {
                    e("http code :" + res.statusCode);
                }
            },
        });
    });
};
