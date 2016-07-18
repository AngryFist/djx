var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

function copy(project,files){
    for(var key in files){
        fs.copy(project + files[key], project + key, function(err){
            if (err) return console.error(err)
        })
    }
} 


function fileCopy(project,files){
    return Promise.all([copy(project,files)])  
}


module.exports = fileCopy;