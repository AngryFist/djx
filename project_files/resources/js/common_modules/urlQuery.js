define([], function() {
    //获取URL参数
    var Init = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);  
        if (r != null) return unescape(r[2]);
        return '';  
    }

    return {
        Init : Init
    }
})