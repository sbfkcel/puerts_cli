# Puerts Cli

Puerts Cli 是一个 PuerTS 快速上手脚手架工具，通过本工具可以将 Puerts 应用于项目中。

## 快速上手
- 安装 `Node.js 15.15.0+`（[Node.js官网](https://nodejs.org/en/)）
- 安装 `Puerts Cli` 脚手架
    - 终端执行 `npm install @puerts/cli -g`
    - 检查是否安装成功
        - 终端执行 `puer -v`，有输出版本号则说明安装成功
- 使用 `Unity 2021+ LTS` 创建一个空项目
- 在项目中添加 `Puerts`
    - [下载 `Puerts`](https://github.com/Tencent/puerts/tags)
    - 解压并将 `Puerts` 目录复制到项目的 `Assets/` 目录下，即：`Assets/Puerts/`
- 在项目中添加 `PuertsWebGL`（无需支持 Web、微信小游戏可以不用）
    - [下载 `PuertsWebGL`](https://github.com/zombieyang/puerts_unity_webgl_demo/tags) 并解压
    - 在解压目录内找到 `package` 目录并重命名为 `PuertsWebGL`
    - 将重命名好的 `PuertsWebGL` 目录复制到项目的 `Assets/` 目录下，即：`Assets/PuertsWebGL/`
- 在项目中添加 `微信小游戏转换工具`（无需支持 Web、微信小游戏可以不用）
    - [下载微信小游戏转换工具 `Unity` 插件](https://game.weixin.qq.com/cgi-bin/gamewxagwasmsplitwap/getunityplugininfo?download=1)
    - 双击 `minigame.xxx.unitypackage` 将插件导入到项目
- 初始化一个 `Puerts` 项目
    - 终端进入到创建好的 `Unity项目` 目录中
    - 终端执行 `puer init` 初始化一个 `Puerts` 项目
- 允许不安全代码（Blittables 需要用到）
    - UnityEditor菜单 -> `Editor` -> `Project Settings` -> `Player` -> `Other Settings` -> `Allow 'unsafe' Code`
- 使用 `Puerts` 生成关联 `Code`
    - UnityEditor菜单 -> `PuerTS` -> `Clear Generated Code`
    - UnityEditor菜单 -> `PuerTS` -> `Generated Code`
    - UnityEditor菜单 -> `PuerTS` -> `Generated index.d.ts (global.CS style)`
- 编译 `Puerts` 项目
    - 终端进入到创建好的 `Unity项目` 目录中
    - 终端执行 `puer build`，工具会将项目所有的 `TS` 文件编译为 `JS`
- 预览项目
    - 使用 `Unity Editor` 打开项目
    - 双击 `Assets/Scenes/App.unity` 场景
    - 点击 `Play` 即可看到运行效果
- 进入开发模式
    - 终端进入到创建好的 `Unity项目` 目录中
    - 终端执行 `puer dev`，此时工具会监听项目中的 `TS` 文件是否有修改，如有修改则会实时将其编译为 `JS` 文件


## 将项目编译为 Web 或 微信小游戏工程

- 导出为 Web 或 微信小游戏工程
    - 确保 UnityEditor 有安装 Unity-WebGL-Support
    - 将项目色彩空间改为 `Gamma`
        - UnityEditor菜单 -> `Editor` -> `Project Settings` -> `Player` -> `Other Settings` -> `Color Space` -> `Gamma`
    - 确保项目已经有安装 `PuertsWebGL`、`微信小游戏转换工具`
    - UnityEditor菜单 `微信小游戏` -> `转换小游戏` 在弹出的转换窗口中填写以下信息
        - 游戏appid，[在微信公众平台中申请](https://mp.weixin.qq.com/)
            - 在这里也可以不设置，后续自己在小游戏工程内进行修改
        - 小游戏项目名称，随便填写
        - 导致路径，这里建议与 `puer.config.js` 中的 `minigameOutputDir` 配置项目保持一致
            - `puer.config.js` 文件在执行 `puer init` 时会自动创建，文件默认位置：`项目/TS/puer.config.js`
            - `minigameOutputDir` 默认为 `桌面/项目目录名称/`
        - 点击 `导出WEBGL并转换为小游戏（常用按钮）` 导出项目
            - 如果导出遇到错误，请根据 UnityEditor Console 面板中的提示排除故障
- 编译 puerts 运行时支持
    - 终端 `cd Unity项目目录`
    - 终端 `puer build --target minigame --browse`
        - 脚手架会编译 `puerts运行时` 以及项目中的 `TS` 并自动接好相关入口
        - 不出意外终端会输出浏览器预览地址，直接访问即可预览效果
        - 如果 `puer.config.js` 中的 `minigameOutputDir` 配置项与 `微信小游戏转换工具` 导出目录不一致则需要根据提示自行手动接入

> 建议：微信小程序、小游戏相关的技术生态都是基于浏览器技术之上的，所以要先保证浏览器上可正常运行然后再打工小游戏工程来调试

## 对 Puerts Cli 工具进行二次开发

如希望参与改进本工具或生产需要进行二次开发本工具的请阅读 [Developer Guide](./DEVELOP.md)。

## 补充说明

- 建议使用 `PuerTS_Nodejs` 运行时，可以直接使用 `Node` 现有的模块
    - 引入 node_modules、node 自带模块，请使用 `require` 方法引入
        - PuerTS目前未实现完整 `import` 支持
        - `import` 目前只支持本地模块
        - 如果项目要兼容 `Web`、`微信小游戏`，使用 `Node` 模块需要自行处理好兼容
- 着色器对 WebGL 有做兼容支持
- 不建议直接使用引擎自带的资源，例如：`Shader.Find("Particles/Standard Unlit")`，所有资源都在项目目录中能直接找得到
- 引入相对模块请以 `./`、`../` 开头，否则编译器可能无法找到

## 工具帮助

Puerts Cli 自带帮助手册，通过添加 `--help` 参数来查看每个命令及相关参数的帮助说明。

```bash
# 查看当前可用的命令
puer -h

# 查看 build 命令使用参数
puer build -h

# ...
```

## 重要参与者

Tencent [@zombieyang](https://github.com/zombieyang)、4399 Games [@sbfkcel](https://github.com/sbfkcel)

## 相关项目及资料

- [Puerts](https://github.com/Tencent/puerts)
- [puerts_unity_demo](https://github.com/chexiongsheng/puerts_unity_demo)
- [puerts_unity_webgl_demo](https://github.com/zombieyang/puerts_unity_webgl_demo)
- [minigame-unity-webgl-transform](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform)
- [微信小游戏开发者文档-快速上手](https://developers.weixin.qq.com/minigame/dev/guide/)
- [Unity WebGL 微信小游戏适配](https://developers.weixin.qq.com/minigame/dev/guide/game-engine/unity-webgl-transform.html)