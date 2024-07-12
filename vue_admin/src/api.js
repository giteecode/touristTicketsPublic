import http from "@/utils/ajax/http";
import { extend } from "@/utils/extend";

const api = {
    code: {
        OK: 0,
    },
    user: {
        login: "/api/user/login",
        tokenLogin: "/api/user/isLogin",
        logout: "/logout",
    },
    checkUpdate: "/api/user/sh",
    editorPassword: "/api/admins/editPassword",
    checkField: "/api/user/checkno",
    dbQuery: "/api/user/query",
    dbSelect: "/api/user/select",

    payment: "payment.do",

    captch() {
        var url = "/api/user/captch?rd=" + Math.floor(Math.random() * 100000);
        return new Promise((resolve, reject) => {
            http.get(url).then((res) => {
                var url = res.data;
                resolve(url);
            }, reject);
        });
    },
    search: {
        select: "/api/user/selectUpdateSearch.do",
        table: "/api/user/tableAjax.do?a=table",
        selectView: "/api/user/selectView",
        all: "/api/user/selectAll",
    },
    attachment: {
        uploadUrl: "/api/user/upload_re",
        upload(file) {
            return new Promise((resolve, reject) => {
                var formdata = new FormData();
                formdata.append("fujian", file, file.name || "tmp.png");
                http.post(api.attachment.uploadUrl, formdata)
                    .then((res) => {
                        if (res.code == api.code.OK) {
                            resolve(res.data);
                        } else {
                            reject(res.msg);
                        }
                    })
                    .catch((err) => {
                        reject(err.message);
                    });
            });
        },
    },
};

export default api;
