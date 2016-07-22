var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

function del(project,type){

    type == 'web' ? type = 'wap' : type = 'web';

    var files = [
        project + '/html/index_' + type + '.html',
        project + '/resources/css/reset_' + type + '.css',
        project + '/resources/js/require_config_' + type + '.js'
    ]

    return files.map(function(item){
        return fs.remove(item, function(err) {
          if (err) return console.error(err)

        })
    }) 
} 


function fileDelete(project,type){
    return Promise.all([del(project,type)])  
}


module.exports = fileDelete;