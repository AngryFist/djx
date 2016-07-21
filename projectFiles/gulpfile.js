var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    minimist = require('minimist'),
    cssmin = require('gulp-cssmin'),
    gulpUtil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    clean = require('gulp-clean'),
    requirejsOptimize = require('gulp-requirejs-optimize');

var publicDir = 'Application/Public/',
    //requireOutDir = 'Application/Public/dist/';
    jsReleaseDir = 'Application/Public/js/release/';

//接收一个env参数
//一般用于指定打包的版本号等信息
var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || '' }
};

var options = minimist(process.argv.slice(2), knownOptions);

var checkEnv = (env, type) => {

    if(!env) return gulpUtil.log(gulpUtil.colors.red('操作失败 -> 请指定版本号！ --env x.x.x'));

    if(!/^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(options.env)) return gulpUtil.log(gulpUtil.colors.red('操作失败 -> 请使用正确的版本号命名规则 --env x.x.x'));

    if(type === 'isBuild' && fs.existsSync(jsReleaseDir + options.env)) return gulpUtil.log(gulpUtil.colors.red('操作失败 -> 该版本已存在, 请使用更高的版本号进行构建'));

    if(type === 'isClean' && !fs.existsSync(jsReleaseDir + options.env)) return gulpUtil.log(gulpUtil.colors.red('操作失败 -> 该版本的文件不存在，无需清理'));

    return 'ok';
}


//require js打包
gulp.task('build', function () {
    if(checkEnv(options.env, 'isBuild') === 'ok'){
        buildRequireJS();
        configWrite();
    }
});
//版本清理
gulp.task('clean', function () {
    if(checkEnv(options.env, 'isClean') === 'ok'){
        return gulp.src(requireOutDir + options.env, {read: false})
            .pipe(clean());
    }
});

var buildRequireJS = () => {
    return gulp.src(publicDir + 'modules/*Main.js')
        .pipe(requirejsOptimize(function(file) {
            return {
                paths: {  //相对baseUrl的路径
                    jquery: '../js/vendor/jquery',
                    jPlayer: '../js/vendor/jquery.jplayer.min',
                    jqueryUI: '../js/vendor/jquery-ui',
                    ajaxFileUpload : '../js/vendor/ajaxFileUpload',
                    json2: '../js/vendor/json2'
                },
                exclude : ['jquery','jPlayer','jqueryUI','ajaxFileUpload','json2'],
                fileExclusionRegExp: /^(r|build)\.js|dist|build$/, 
                optimize: 'uglify'
            }
        }))
        .pipe(gulp.dest(jsReleaseDir + options.env));
}

gulp.task('cssmin', function () {
    gulp.src([publicDir + 'css/*.css', '!' + publicDir + 'css/*min.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest(publicDir + 'css'));
});

var configWrite = () => {
    fs.readFile(publicDir + 'js/require.js',  'utf8', (err, data) => {
      if (err) return console.log(err);
      var data = data.replace(/var releaseVersion = '\d{1,2}\.\d{1,2}\.\d{1,2}';/g, 'var releaseVersion = \'' + options.env + '\';').replace(/var jsDebug = true;/g, 'var jsDebug = false;');
      fs.writeFile(publicDir + 'js/require.js', data, 'utf8');
      gulpUtil.log(gulpUtil.colors.green('操作进度 -> 修改配置文件成功'));
    });
}

