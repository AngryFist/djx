var jsDir = '../resources/js'
var releaseVersion = '1.0.0';
var jsDebug = true;
var baseUrl = jsDebug ? jsDir + '/require_modules' : jsDir + '/release/' + releaseVersion;

//requirejs config
require.config({
    baseUrl : baseUrl,
    paths: {
        'common' : '../common_modules',
        'jquery' : '../vendor/jquery/1.12.1/jquery'
    },
    shim: {
        // 'jqueryUI' : {
        //     deps: [ "jquery" ],
        //     exports: "jqueryUI"
        // }
    },
    deps : ['jquery']
});