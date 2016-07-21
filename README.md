# DJX

到家美食会前端框架

## 安装

    $ npm install djx -g

## 如何使用

    1. $ djx --type wap | web <project name>
    2. $ cd <project name>
    3. $ npm install

## 如何打包

    1. $ gulp build --env x.x.x  /* 构建requirejs, 并替换require配置信息
    2. $ gulp clean --env x.x.x  /* 清理某个版本的js文件

    Tips: 1. 打包过程中如果某一步出现错误，则执行clean任务清除当前版本号的文件后，再重新运行build命令

