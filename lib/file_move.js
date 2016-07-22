var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

function copy(project,type){

    var files = [
        project + '/html/index_' + type + '.html',
        project + '/resources/css/reset_' + type + '.css',
        project + '/resources/js/require_config_' + type + '.js'
    ]

    return files.map(function(item){
        return fs.move(item, item.replace('_' + type, ''), function(err){
            if (err) return console.error(err)

        })
    }) 
} 


function fileCopy(project,type){
    return Promise.all([copy(project,type)])  
}


module.exports = fileCopy;