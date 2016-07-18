var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));



var root = __dirname.replace(/djx\/lib/,'djx/').replace(/djx\\lib/,'djx/')
console.log(root);
function initProject(project, type){
  return fs.copyAsync(root + 'projectFiles', project)
    .then(function(err){
      return err ?  console.error(err) : console.log(type + '项目初始化成功');
    })
}


module.exports = initProject;
