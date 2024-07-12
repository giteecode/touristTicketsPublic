const pre = "vx-";

export function setCache(name, value, exp = null) {
    var data = {
        data: value,
        exp: exp ? exp + Math.floor(new Date().getTime() / 1000) : null,
    };
    var v = JSON.stringify(data);
    localStorage.setItem(pre + name, v);
}

export function removeCache(name) {
    localStorage.removeItem(pre + name);
}

export function getCache(name, defaults = null) {
    var result = localStorage.getItem(pre + name);
    if (!result) {
        return defaults;
    }
    try {
        var obj = JSON.parse(result);
        if (obj.exp && obj.exp < Math.floor(new Date().getTime() / 1000)) {
            removeCache(name);
            return defaults;
        }
        return obj.data;
    } catch (e) {
        console.error(e);
        return defaults;
    }
}

export default {
    setCache,
    removeCache,
    getCache,
};
