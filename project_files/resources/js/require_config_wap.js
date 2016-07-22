var jsDir = '../resources/js'
var releaseVersion = '1.0.0';
var jsDebug = true;
var baseUrl = jsDebug ? jsDir + '/require_modules' : jsDir + '/release/' + releaseVersion;

//requirejs config
require.config({
    baseUrl : baseUrl,
    paths: {
        'zepto' : '../vendor/zepto/1.2.0/zepto',
        'common' : '../common_modules'
    },
    shim: {
        // 'jqueryUI' : {
        //     deps: [ "jquery" ],
        //     exports: "jqueryUI"
        // }
    },
    deps : ['jquery']
});