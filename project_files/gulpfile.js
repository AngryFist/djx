var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    minimist = require('minimist'),
    cssmin = require('gulp-cssmin'),
    gulpUtil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gulpCopy = require('gulp-file-copy'),
    fs = require('fs'),
    clean = require('gulp-clean'),
    requirejsOptimize = require('gulp-requirejs-optimize');

var distDir = 'dist/'
    resoucesDir = 'resources/',
    jsReleaseDir = 'js/release/',
    cssReleaseDir = 'css/release/',
    mainJsDir = 'js/require_modules/';

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

    if(type === 'isBuild' && fs.existsSync(distDir + resoucesDir + jsReleaseDir + options.env)) return gulpUtil.log(gulpUtil.colors.red('操作失败 -> 该版本已存在, 请使用更高的版本号进行构建'));

    if(type === 'isClean' && !fs.existsSync(distDir + resoucesDir + jsReleaseDir + options.env)) return gulpUtil.log(gulpUtil.colors.red('操作失败 -> 该版本的文件不存在，无需清理'));

    return 'ok';
}

//require js打包
gulp.task('build', function () {
    if(checkEnv(options.env, 'isBuild') === 'ok'){
        gulp.run('cleanBuild');
    }
});
//版本清理
gulp.task('clean', function () {
    gulpUtil.log(gulpUtil.colors.green('操作提示 -> 清理文件 v' + options.env + '......'));
    if(checkEnv(options.env, 'isClean') === 'ok'){
        return gulp.src([distDir + resoucesDir + jsReleaseDir + options.env, distDir + resoucesDir + cssReleaseDir + options.env ], {read: false})
            .pipe(clean());
    }
});


//copy files
gulp.task('copyFiles', () => {
        gulpUtil.log(gulpUtil.colors.green('操作提示 -> 复制文件......'));
        return gulp.src(['./**/*', '!./node_modules', '!./node_modules/**/*', '!./dist', '!./dist/**/*', '!./README.md', '!./package.json', '!./gulpfile.js'])
            .pipe(gulp.dest('./dist'));
});

gulp.task('buildRequireJS', ['copyFiles'], () => {
    gulpUtil.log(gulpUtil.colors.green('操作提示 -> 构建JS......'));
    return gulp.src(distDir + resoucesDir + mainJsDir + '*Main.js')
        .pipe(requirejsOptimize(function(file) {
            return {
                baseUrl : distDir + resoucesDir + mainJsDir,
                paths: {  //相对baseUrl的路径
                    'common' : '../common_modules',
                    'jquery' : '../vendor/jquery/1.12.1/jquery'
                },
                exclude : ['jquery'],
                fileExclusionRegExp: /^(r|build)\.js|dist|build$/, 
                optimize: 'uglify'
            }
        }))
        .pipe(gulp.dest(distDir + resoucesDir + jsReleaseDir + options.env));
});

gulp.task('cssmin', ['configWrite'], () => {
    gulpUtil.log(gulpUtil.colors.green('操作提示 -> 压缩CSS......'));
    gulp.src([distDir + resoucesDir + 'css/**/*.css', '!' + distDir + resoucesDir + 'css/**/*.min.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(distDir + resoucesDir + cssReleaseDir + options.env));
});
//替换requireJS-config中的配置信息
gulp.task('uglyfyConfig', ['buildRequireJS'], () => {
    gulpUtil.log(gulpUtil.colors.green('操作提示 -> 压缩配置文件......'));
    return gulp.src(distDir + resoucesDir + 'js/require_config.js')
            .pipe(uglify())
            .pipe(gulp.dest(distDir + resoucesDir + 'js'));
});
gulp.task('configWrite', ['uglyfyConfig'], () => {
    gulpUtil.log(gulpUtil.colors.green('操作提示 -> 修改配置文件......'));
    fs.readFile(distDir + resoucesDir + 'js/require_config.js',  'utf8', (err, data) => {
        if (err) return console.log(err);
        var    configData = data.match(/require\.config\(\{(.|\n){0,}\}\)/g);
        var newConfigData = configData[0].replace(/\.\.\//g, '\.\.\/\.\.\/');
        var data = data.replace(/releaseVersion {0,}= {0,}"\d{1,2}\.\d{1,2}\.\d{1,2}"/g, 'releaseVersion=\'' + options.env + '\'').replace(/jsDebug {0,}= {0,}!0/g, 'jsDebug=0').replace(configData[0], newConfigData);
        fs.writeFile(distDir + resoucesDir + 'js/require_config.js', data, 'utf8');
    });
});
gulp.task('cleanBuild', ['cssmin'], function () {
    gulpUtil.log(gulpUtil.colors.green('操作提示 -> 清理不必要的文件......'));
    return gulp.src([distDir + resoucesDir + mainJsDir, distDir + resoucesDir + 'js/common_modules', distDir + resoucesDir + 'css/*', '!' + distDir + resoucesDir + cssReleaseDir], {read: false})
        .pipe(clean());
});
