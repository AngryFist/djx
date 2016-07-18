#!/usr/bin/env node
var program = require('commander'),
    Promise = require("bluebird"),
    fs = require('fs'),
    initProject = require('../lib/initProject'),
    fileDeal = require('../lib/fileDeal');


program
    .version(require('../package.json').version)
    .usage('[options] [project name]')
    .option('-T, --type <web | wap>', 'project type, web or wap, default: web')
    .parse(process.argv);

var pname = program.args[0];
if (!pname) program.help();
//判断项目文件夹是否已存在
var pnameExists = fs.existsSync('./' + pname);
if(pnameExists) return console.log('项目创建失败！！ >> ' + pname + ' 已存在');

var type = program.type ? program.type : 'web';

Promise.all([initProject(pname, type)])
    .then(function(){
        return fileDeal(pname,type)
      })
