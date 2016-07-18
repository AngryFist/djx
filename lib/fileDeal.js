var Promise = require("bluebird"),
    fileDelete = require('../lib/fileDelete');
    fileCopy = require('../lib/fileCopy');


var deleteFiles = ['/static/css/wap/', '/html/wap', '/static/css/web/', '/html/web'],
    copyFiles = {};

function deal(project,type){
    switch (type) {
        case 'wap':
            deleteFiles.push('/static/js/vendor/jquery');
            copyFiles = {'/static/css/reset.css' : '/static/css/wap/reset.css', '/html/index.html' : '/html/wap/index.html'};
            break;
        default:
            deleteFiles.push('/static/js/vendor/zepto');
            copyFiles = {'/static/css/reset.css' : '/static/css/web/reset.css', '/html/index.html' : '/html/web/index.html'};
            break;
    }
    return Promise.all([fileCopy(project, copyFiles), fileDelete(project,deleteFiles)])
    .then(function(){

    })
}



function fileDeal(project,type){
    return Promise.all([deal(project,type)])
}


module.exports = fileDeal;
