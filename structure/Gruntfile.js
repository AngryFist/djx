module.exports = function (grunt) {


    var pkg = grunt.file.readJSON("package.json");
    var publicDir = './Application/Public/';
    var excludes = ['jquery','jPlayer','jqueryUI','ajaxFileUpload','json2'];

    var updateTime = new Date();

    updateTime = updateTime.getFullYear() + '-' + (updateTime.getMonth()+1) + '-' + updateTime.getDate();

    var npmModules = [];
    var releaseJs = [];
    var uglifyJs = {};
    var minExpand = '-min';


    for (var i = 0; i < pkg.spm.output.length; i++) {

        var modulesItem = {};
        var releaseItem = '';
        var uglifyItem = '';

        var item = pkg.spm.output[i];

        modulesItem.name = item;
        modulesItem.exclude = excludes;

        releaseItem = item + '.js';

        npmModules.push(modulesItem);
        releaseJs.push(releaseItem);

        uglifyItem = publicDir + 'js/.release/' + pkg.version + '/' + releaseItem;
        uglifyJs[uglifyItem] = [uglifyItem];

    }

    //console.log(uglifyJs)

    grunt.initConfig({
        pkg: pkg,
        requirejs: {
            build: {
                options: {
                    appDir: publicDir + 'modules',
                    baseUrl: './',
                    dir: publicDir + '/js/.release/<%= pkg.version %>',
                    paths: {  //相对baseUrl的路径
                          jquery: '../js/vendor/jquery',
                          jPlayer: '../js/vendor/jquery.jplayer.min',
                          jqueryUI: '../js/vendor/jquery-ui',
                          ajaxFileUpload : '../js/vendor/ajaxFileUpload',
                          json2: '../js/vendor/json2'
                    },
                    shim: {
                      jPlayer: {
                          deps: ['jquery'],
                          exports: 'jPlayer'
                      },
                      jqueryUI: {
                          deps: ['jquery'],
                          exports: 'jqueryUI'
                      },
                      ajaxFileUpload: {
                          deps: ['jquery'],
                          exports: 'ajaxFileUpload'
                      }
                  },
                  modules: npmModules,
                  fileExclusionRegExp: /^(r|build)\.js|.*\.scss|help_style|css|images|dist|build$/,  //过滤，匹配到的文件将不会被输出到输出目录去
                  optimize: 'none',
                  optimizeCss: 'standard', 
                  
                  removeCombined: true   //如果为true，将从输出目录中删除已合并的文件
                }
            }
        },
        uglify: {
            options: {
              banner: "/*\n    Author : <%= pkg.author.name %> \n    upadteTime : " + updateTime + " \n    description : <%= pkg.author.description %> \n */ \n"
            },
            cmid: {
                files: uglifyJs
            }
        },
        copy: {
            options: {
                force: true
            },
            buildedjs: {
                files: [
                  { expand: true, cwd: publicDir + '/js/.release/<%= pkg.version %>', src: ['*.js'], dest: publicDir + '/js/release/<%= pkg.version %>', filter: 'isFile' },
                ]
            },
            spm: "<%= pkg.spm %>",

        },
        cssmin: {
            options: {
              banner: "/*<%= pkg.version %>*/"
            },
            build:{
                expand : true,
                src : publicDir + 'css/*.css',
                dest : '',
                ext: minExpand + '.css'
            }
        },
        clean: {
            options: {
                force: true
            },
            cssmin : [publicDir + "css/*-min.css"],
            init: [publicDir + "js/release/<%= pkg.version %>"],
            build: [publicDir + "js/.release"]
            //"debug": ["stjs/<%= pkg.family %>/**/*-debug.js"]
        },
        watch: {
            client: {
                options: {
                    livereload: true
                },
                files: ['**/*.html', 'stcss/**/*.css', 'stjs/**/*.js', 'stimg/**/*']
                
            }
        }
    })


    grunt.loadNpmTasks('grunt-contrib-jshint'); //js检查
    grunt.loadNpmTasks('grunt-contrib-requirejs'); //requirejs优化
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-aetheon-cssmin");

    grunt.registerTask('replaceRequireFile', 'replaceRequireFile', replaceRequireFile);
    //grunt.registerTask('replaceHtmlFile', 'replaceHtmlFile', replaceHtmlFile);
    grunt.registerTask('replaceHtmlFileCSS', 'replaceHtmlFileCSS', replaceHtmlFileCSS);

    grunt.registerTask('buildjs', 'js build', function(){
      
      grunt.task.run('clean:init');
      grunt.task.run('requirejs');
      grunt.task.run('uglify');
      grunt.task.run('copy:buildedjs');
      grunt.task.run('clean:build');
      grunt.task.run('replaceRequireFile');
      //grunt.task.run('replaceHtmlFile');
    });

    grunt.registerTask('buildcss', 'css build', function(){
      grunt.task.run('clean:cssmin');
      grunt.task.run('cssmin:build');
      grunt.task.run('replaceHtmlFileCSS');
    });

    //自动监控页面
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('live', ['watch']);


    //替换requirejs 配置信息
    function replaceRequireFile(){
        var requireFile = grunt.file.read(publicDir + 'js/require.js');

        requireFile = requireFile.replace(/releaseVersion = '\d\.\d\.\d'/, "releaseVersion = '" + pkg.version + "'");
        requireFile = requireFile.replace(/jsDebug = true/, "jsDebug = false");

        grunt.file.write(publicDir + 'js/require.js', requireFile);
        grunt.log.ok('require 配置信息修改成功');
    }

    //替换HTML中的JS路径
    // function replaceHtmlFile(){
    //     var viewDir = "./Application/Business/View/";
    //     var noneDo = true;
    //     for(var i = 0; i < pkg.view.length; i++){
    //         var htmlTemplate = grunt.file.read(viewDir + pkg.view[i] + '/index.html');
    //         var dataMain = htmlTemplate.match(/data-main="[a-zA-Z0-9]+"/);
    //         if(dataMain){
    //           dataMain = dataMain[0];
    //           var dataMainMin = dataMain.substring(0, dataMain.length-1);
    //           dataMainMin = dataMainMin + minExpand + '"';
    //           htmlTemplate = htmlTemplate.replace(dataMain,dataMainMin);
    //           grunt.file.write(viewDir + pkg.view[i] + '/index.html', htmlTemplate);
    //           grunt.log.ok(pkg.view[i] + '/index.html' + ' 修改成功');
    //           noneDo = false;
    //         }
    //     }
    //     if(noneDo) grunt.log.ok('没有HTML文件需要被修改！');   
    // }
    //替换HTML中的CSS路径
    function replaceHtmlFileCSS(){
        var viewDir = "./Application/Business/View/";
        var noneDo = true;
        for(var i = 0; i < pkg.view.length; i++){
            var htmlTemplate = grunt.file.read(viewDir + pkg.view[i] + '/index.html');
            var cssLinks = htmlTemplate.match(/href="[a-zA-Z0-9-_\/\.]+\.css"/g);
            if(cssLinks){
              for(var j = 0; j < cssLinks.length; j++){
                if(cssLinks[j].indexOf('min') == -1){
                  noneDo = false;
                  var curCssLink = cssLinks[j].substring(0, cssLinks[j].length-5)
                  //grunt.log.ok(curCssLink);
                  curCssLink = curCssLink + minExpand + '.css"';

                  htmlTemplate = htmlTemplate.replace(cssLinks[j],curCssLink);
                }
              }
              
              if(!noneDo){
                grunt.file.write(viewDir + pkg.view[i] + '/index.html', htmlTemplate);
                grunt.log.ok(pkg.view[i] + '/index.html' + ' 修改成功');
              }
            }
        }
        if(noneDo) grunt.log.ok('没有HTML文件需要被修改！');   
    }
      
};