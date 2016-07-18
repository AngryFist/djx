var Promise = require("bluebird"),
    fileDelete = require('../lib/fileDelete');


var files = [];

function deal(project,type){
    switch (type) {
        case 'wap':
            files = ['/static/js/verdor/jquery'];
            break;
        default:
            files = ['/static/js/verdor/jquery'];
            break;
    }
    return Promise.all([fileDelete(project,files)])
    .then(function(){
        return  console.log('remove unrelated files');
    })
}



function fileExclude(project,outs){
    return Promise.all([deal(project,outs)])
}


module.exports = fileExclude;
