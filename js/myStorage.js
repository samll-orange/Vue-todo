;(function () {
    //将set、get方法暴露出去
    window.ms = {
        set: set,
        get: get,
    };
    function set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    function get(key) {
        var json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json);
        }
    }
}());

//在浏览器里面进行数据的存取
ms.set('name', 'zhixiao');
var name = ms.get('name');
console.log('name:', name);
