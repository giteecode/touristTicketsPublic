// geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// Distributed under the MIT License

const { extend , isFunction,isArray,isObject,inArray,isString,empty,isset } = require('./extend.js')

var BITS = [16, 8, 4, 2, 1];

var BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
var NEIGHBORS = { right  : { even :  "bc01fg45238967deuvhjyznpkmstqrwx" },
    left   : { even :  "238967debc01fg45kmstqrwxuvhjyznp" },
    top    : { even :  "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
    bottom : { even :  "14365h7k9dcfesgujnmqp0r2twvyx8zb" } };
var BORDERS   = { right  : { even : "bcfguvyz" },
    left   : { even : "0145hjnp" },
    top    : { even : "prxz" },
    bottom : { even : "028b" } };

NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
NEIGHBORS.top.odd = NEIGHBORS.right.even;
NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
NEIGHBORS.right.odd = NEIGHBORS.top.even;

BORDERS.bottom.odd = BORDERS.left.even;
BORDERS.top.odd = BORDERS.right.even;
BORDERS.left.odd = BORDERS.bottom.even;
BORDERS.right.odd = BORDERS.top.even;

function refine_interval(interval, cd, mask) {
    if (cd&mask)
        interval[0] = (interval[0] + interval[1])/2;
    else
        interval[1] = (interval[0] + interval[1])/2;
}

function calculateAdjacent(srcHash, dir) {
    srcHash = srcHash.toLowerCase();
    var lastChr = srcHash.charAt(srcHash.length-1);
    var type = (srcHash.length % 2) ? 'odd' : 'even';
    var base = srcHash.substring(0,srcHash.length-1);
    if (BORDERS[dir][type].indexOf(lastChr)!=-1)
        base = calculateAdjacent(base, dir);
    return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)];
}

export function decodeGeoHash(geohash) {
    var is_even = 1;
    var lat = [];
    var lon = [];

    lat[0] = -90.0;  lat[1] = 90.0;
    lon[0] = -180.0; lon[1] = 180.0;
    var lat_err = 90.0;  var lon_err = 180.0;

    for (i=0; i<geohash.length; i++) {
        c = geohash[i];
        cd = BASE32.indexOf(c);
        for (j=0; j<5; j++) {
            mask = BITS[j];
            if (is_even) {
                lon_err /= 2;
                refine_interval(lon, cd, mask);
            } else {
                lat_err /= 2;
                refine_interval(lat, cd, mask);
            }
            is_even = !is_even;
        }
    }
    lat[2] = (lat[0] + lat[1])/2;
    lon[2] = (lon[0] + lon[1])/2;

    return { latitude: lat, longitude: lon};
}

export function encodeGeoHash(latitude, longitude) {
    var is_even=1;
    var i=0;
    var lat = []; var lon = [];
    var bit=0;
    var ch=0;
    var precision = 12;
    var geohash = "";
    var mid;

    lat[0] = -90.0;  lat[1] = 90.0;
    lon[0] = -180.0; lon[1] = 180.0;

    while (geohash.length < precision) {
        if (is_even) {
            mid = (lon[0] + lon[1]) / 2;
            if (longitude > mid) {
                ch |= BITS[bit];
                lon[0] = mid;
            } else
                lon[1] = mid;
        } else {
            mid = (lat[0] + lat[1]) / 2;
            if (latitude > mid) {
                ch |= BITS[bit];
                lat[0] = mid;
            } else
                lat[1] = mid;
        }

        is_even = !is_even;
        if (bit < 4)
            bit++;
        else {
            geohash += BASE32[ch];
            bit = 0;
            ch = 0;
        }
    }
    return geohash;
}




// 定义一些常量
const x_PI = 3.14159265358979324 * 3000.0 / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换 / 即百度转谷歌、高德
 * @param { Number } bd_lon
 * @param { Number } bd_lat
 */
export function bd09togcj02 (bd_lon, bd_lat) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0
    var x = bd_lon - 0.0065
    var y = bd_lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    var gg_lng = z * Math.cos(theta)
    var gg_lat = z * Math.sin(theta)
    return [gg_lng, gg_lat]
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换 / 即谷歌、高德 转 百度
 * @param { Number } lng
 * @param { Number } lat
 */
export function gcj02tobd09 (lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
    var bd_lng = z * Math.cos(theta) + 0.0065
    var bd_lat = z * Math.sin(theta) + 0.006
    return [bd_lng, bd_lat]
}

/**
 * WGS84坐标系转火星坐标系GCj02 / 即WGS84 转谷歌、高德
 * @param { Number } lng
 * @param { Number } lat
 */
export function wgs84togcj02 (lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0)
        var dlng = transformlng(lng - 105.0, lat - 35.0)
        var radlat = lat / 180.0 * PI
        var magic = Math.sin(radlat)
        magic = 1 - ee * magic * magic
        var sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
        const mglat = lat + dlat
        const mglng = lng + dlng
        return [mglng, mglat]
    }
}

/**
 * GCJ02（火星坐标系） 转换为 WGS84 / 即谷歌高德转WGS84
 * @param { Number } lng
 * @param { Number } lat
 */
export function gcj02towgs84 (lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0)
        var dlng = transformlng(lng - 105.0, lat - 35.0)
        var radlat = lat / 180.0 * PI
        var magic = Math.sin(radlat)
        magic = 1 - ee * magic * magic
        var sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
        const mglat = lat + dlat
        const mglng = lng + dlng
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}

/**
 * 百度坐标系转wgs84坐标系
 * @param {*} lng
 * @param {*} lat
 */
export function bd09towgs84 (lng, lat) {
    // 百度坐标系先转为火星坐标系
    const gcj02 = bd09togcj02(lng, lat)
    // 火星坐标系转wgs84坐标系
    const result = gcj02towgs84(gcj02[0], gcj02[1])
    return result
}

/**
 * wgs84坐标系转百度坐标系
 * @param {*} lng
 * @param {*} lat
 */
export function wgs84tobd09 (lng, lat) {
    // wgs84先转为火星坐标系
    const gcj02 = wgs84togcj02(lng, lat)
    // 火星坐标系转百度坐标系
    const result = gcj02tobd09(gcj02[0], gcj02[1])
    return result
}

/**
 * 经度转换
 * @param { Number } lng
 * @param { Number } lat
 */
function transformlat (lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
    return ret
}

/**
 * 纬度转换
 * @param { Number } lng
 * @param { Number } lat
 */
function transformlng (lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
    return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param {*} lng
 * @param {*} lat
 */
function outOfChina (lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
}


function toRad(d) {  return d * Math.PI / 180; }
export function getDisance(lat1, lng1, lat2, lng2) {  // lat为纬度, lng为经度, 一定不要弄错
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
}

export function disanceToUnit( size )
{
    size = Math.abs(size);
    var unit = ['m' , 'km'];
    var index = 0;
    if(size > 1000){
        index++;
        size /= 1000;
    }
    return parseFloat(size).toFixed(2) + unit[index];
}

function handlerTrans(type,address){
    var result = extend(true, {} , address);
    if(type == 'bd09'){
        var res = wgs84tobd09(result.longitude , result.latitude);
        result.longitude = res[0];
        result.latitude = res[1];
    }else if( type == 'gcj02'){
        var res = wgs84togcj02(result.longitude , result.latitude);
        result.longitude = res[0];
        result.latitude = res[1];
    }
    return result;
}

var address = null;
export function getLocation( type , callback , error ){
    wx.getLocation({
        type:'wgs84',
        isHighAccuracy:true,
        success:(res)=>{
            address = res;
            address.longitude = parseFloat(address.longitude);
            address.latitude = parseFloat(address.latitude);

            var data = handlerTrans(type,res);
            callback(data);
        },
        fail(e,data){
            if(address){
                var data = handlerTrans(type,address);
                callback(data);
            }else{
                wx.showToast({
                    title:'获取定位失败',
                    icon:'error'
                });
                if(error){
                    error(e,data);
                }
            }
        }
    });
}

