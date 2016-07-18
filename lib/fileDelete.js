var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

function del(project,files){
    return files.map(function(item){
        return fs.removeAsync(project + item)
    }) 
} 


function fileDelete(project,files){
    return Promise.all([del(project,files)])  
}


module.exports = fileDelete;