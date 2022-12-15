# Developer Guide

需要对本工具进行二次开发的，不建议使用 `npm` 来安装。

## 安装

- 克隆本项目 `git clone git@github.com:sbfkcel/puerts_cli.git`
- 拉取依赖
    - 终端运行 `cd PuertsCli`
    - 终端运行 `npm install`
- 挂载全环境变量
    - 终端运行 `npm link`

现在通过 `prev -v` 则可以输出版本号且正常使用了。

## 文件结构

```bash
├── Bin                  # cli 入口目录
├── Commands             # 命令存放目录，一个目录一个命令
│   ├── build            # 命令目录
│   │   ├── help.js      # 必须要有，命令帮助及参数配置文件
│   │   └── index.js     # 必须要有，命令入口文件，需要向外提供一个方法，方法有一个接收参数对象包含了终端传入的参数、配置、项目信息、当前执行命令所在的路径等
│   ├── dev
│   └── init
├── index.js
├── lib
└── package.json
```