//js release版本控制 属性名与页面英文名称保持一致
var releaseVersion = '2.0.0';

var jsDebug = false;

var baseUrl = jsDebug ? publicPath + '/modules' : publicPath + '/js/release/' + releaseVersion;

//requirejs config
require.config({
    baseUrl : baseUrl,
    paths: {
        'jquery' : publicPath + '/js/vendor/jquery',
        'jPlayer' : publicPath + '/js/vendor/jquery.jplayer.min',
        'jqueryUI' : publicPath + '/js/vendor/jquery-ui',
        'ajaxFileUpload' : publicPath + '/js/vendor/ajaxFileUpload',
        'json2' : publicPath + '/js/vendor/json2'
    },
    shim: {
        'jPlayer' : {
            deps: [ "jquery" ],
            exports: "jPlayer"
        },
        'jqueryUI' : {
            deps: [ "jquery" ],
            exports: "jqueryUI"
        },
        'ajaxFileUpload' : {
            deps: [ "jquery" ],
            exports: "ajaxFileUpload"
        },
        'json2' : {
            exports: "json2"
        }
        
    }
});

//修复IEconsole报错问题
if (!window.console || !console.firebug){
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i)
        window.console[names[i]] = function() {}
}