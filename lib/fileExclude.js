var Promise = require("bluebird"),
    fileDelete = require('../lib/fileDelete');


var files = [];

function deal(project,type){
    switch (type) {
        case 'wap':
            files = ['/static/js/verdor/jquery'];
            break;
        default:
            files = ['/static/js/verdor/zepto'];
            break;
    }
    console.log(files);
    return Promise.all([fileDelete(project,files)])
    .then(function(){
        return  console.log('remove unrelated files');
    })
}



function fileExclude(project,type){
    return Promise.all([deal(project,type)])
}


module.exports = fileExclude;
