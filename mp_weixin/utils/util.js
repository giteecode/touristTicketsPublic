const config = require('./constants');
const ext = require('./extend.js');
const { isFunction, isArray, isObject, inArray, isString, empty, isset} = ext

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

const handlerKeyValue = list => {
    var result = {};
    for (var i = 0; i < list.length; i++) {
        var ci = list[i];
        result[ci.id] = ci;
    }
    return result;
}

function findIndex(arr, callback) {
    if (!isFunction(callback)) {
        throw new Error('findObject第二个参数是回调函数');
    }
    for (var i in arr) {
        var ci = arr[i];
        if (callback(ci, i)) {
            return i;
        }
    }
    return false;
}

export function substr(str , length)
{
    if(!str) return "";
    var s = formatHtml(str);
    if(s.length > length){
        return s.substr(0,length)+'...';
    }
    return s;
}



function findObject(arr, callback) {
    if (!isFunction(callback)) {
        throw new Error('findObject第二个参数是回调函数');
    }
    for (var i in arr) {
        var ci = arr[i];
        if (callback(ci, i)) {
            return ci;
        }
    }
    return false;
}


function remove(arr, key) {
    if (isObject(key) || isArray(key)) {
        var index = findIndex(arr, r => r === key);
        if (index !== false) {
            remove(arr, index)
        }
    } else {
        arr.splice(key, 1);
    }
}

function formatImageSrc(value) {
    if(isArray(value)){
        value = value[0];
    }
    if (!value) return '';
    if (value.indexOf("data:image") === 0) {
        return value
    }
    if (value.indexOf('/') === 0) {
        return config.fileHost + value;
    }

    var url = value;
    if (!url.match(/^https?:\/\//ig)) {
        return config.fileHost + '/' + value;
    }
    return url;
}

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
function formatRichText(html) {
    let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
        match = match.replace(/src="(.*?)"/ig, function ($0, $1) {
            var src = formatImageSrc($1);
            return `src="${src}"`
        });
        return match;
    });
    newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
        match = match.replace(/width:[^;]+;/gi, 'width:100%;').replace(/width:[^;]+;/gi, 'width:100%;');
        return match;
    });
    newContent = newContent.replace(/<br[^>]*\/>/gi, '');
    newContent = newContent.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;margin:10px 0;"');
    return newContent;
}

function formatHtml( html )
{
    var regex = /(<([^>]+)>)/ig;
    return html.replace(regex , '');
}

function model(content){
    return new Promise((resolve , reject)=>{
        wx.showModal({
            title: '温馨提示：',
            content: content,
            success(re){
                if(re.confirm){
                    resolve()
                }else{
                    reject(re.confirm);
                }
            },
            fail:err=>{
                reject(err);
            }
        })
    })
}



export const setCache = (key, data) => {
    wx.setStorageSync(key, data)
}

export const getCache = (key) => {
    return wx.getStorageSync(key)
}

export const removeCache = (key) => {
    wx.removeStorageSync(key)
}




module.exports = {
    formatTime,
    findIndex,
    findObject,
    model,
    handlerKeyValue,
    remove,
    formatImageSrc,
    substr,
    formatRichText,
    formatHtml,
    setCache,
    getCache,
    removeCache,
    ...ext
}
