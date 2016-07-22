var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));



var root = __dirname.replace(/djx\/lib/,'djx/').replace(/djx\\lib/,'djx/')

function initProject(project, type){
  return fs.copyAsync(root + 'project_files', project)
    .then(function(err){
      return err ?  console.error(err) : console.log(type + '项目初始化成功 \n\rstep1: cd ' + project + '\n\rstep2: npm install');
    })
}


module.exports = initProject;
