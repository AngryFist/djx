define([], function() {
    var pz = function(s){
        return s < 10 ? '0' + s : s;
    };
    //将一个时间戳格式化为日期
    //console.log(date_format.Init(9999999999999, 'Y-M-D h:m:s w'));
    var  Init =  function(timeStamp, typeString){
        if(timeStamp.toString().length > 13) return '时间戳不正确';
        else if(timeStamp == '') var myDate = new Date();
        else var myDate = new Date(parseInt(timeStamp));

        var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

        var timeString = {
            Y : myDate.getFullYear(),
            M : pz(myDate.getMonth() + 1),
            D : pz(myDate.getDate()),
            h : pz(myDate.getHours()),
            m : pz(myDate.getMinutes()),
            s : pz(myDate.getSeconds()),
            w : weekDay[myDate.getDay()]
        }

        return typeString.replace(/Y/g, timeString.Y).replace(/M/g, timeString.M).replace(/D/g, timeString.D).replace(/h/g, timeString.h).replace(/m/g, timeString.m).replace(/s/g, timeString.s).replace(/w/g, timeString.w);
    }

    return {
        Init : Init
    }
})