var Promise = require("bluebird"),
    fileMove = require('../lib/file_move'),
    fileDelete = require('../lib/file_delete'),
    fs = Promise.promisifyAll(require('fs-extra'));


function deal(project,type){
    
    return Promise.all([fileMove(project,type), fileDelete(project,type)])
        .then(function(){

        })

}



function fileDeal(project,type){
    return Promise.all([deal(project,type)])
}


module.exports = fileDeal;
