define(['common/date_format'], function(date_format) {

    var Init = function(){
        console.log(date_format.Init(9999999999999, 'Y-M-D h:m:s w'));
        //console.log($('body').length);
    }

    return {
        Init : Init
    }
        
});