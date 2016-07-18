#!/usr/bin/env node
var program = require('commander'),
    Promise = require("bluebird"),
    initProject = require('../lib/initProject'),
    fileExclude = require('../lib/fileExclude');


program
    .version(require('../package.json').version)
    .usage('[options] [project name]')
    .option('-T, --type <web | wap>', 'project type, web or wap')
    .parse(process.argv);

var pname = program.args[0];
if (!pname) program.help();

var type = program.type ? program.type : 'web';

Promise.all([initProject(pname, type)])
    .then(function(){
        return fileExclude(pname,type)
      })
