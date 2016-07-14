var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));



var root = __dirname.replace(/djx\/lib/,'djx/')
function generateStructure(project,outs){
  return fs.copyAsync(root + 'structure', project)
    .then(function(err){
      return err ?  console.error(err) : console.log('项目初始化成功');
    })
}


module.exports = generateStructure;
