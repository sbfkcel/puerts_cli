# <img src="./logo.svg?v=1"/>

开箱即用的 PuerTS 脚手架工具，通过本工具可以将 Puerts 快速接入并应用于项目中。

**功能特点：**

- 基于 SWC 构建的编译环境，快如闪电
- 无需再手动搭建 Typescript、Webpack 相关编译及打包环境
- 开箱即用的 Souremap、Hot reload、断点调试 等配置集成
- 快速编译 Puerts WebGL 运行时，并能自动完成与Web或微信小游戏项目的对接
- Web、微信小游戏工程拥有编译与预览一体的环境，无需自行再搭建预览环境

> 现阶段仅支持 Unity 项目

## 安装

确保本地已经安装 [Node.js 16.15.0+](https://nodejs.org/en/)

```bash
# 使用npm安装
npm install @puerts/cli -g

# 使用yarn安装
yarn global add @puerts/cli

# 输出版本号，检查是否安装成功
puer -v
```

## 帮助手册

Puerts Cli 自带帮助手册，通过添加 `--help` 参数来查看每个命令及相关参数的帮助说明。

```bash
# 查看当前可用的命令
puer -h

# 查看 build 命令使用参数
puer build -h

# ...
```

## 新手教程

- 使用 `Unity 2021+ LTS` 创建一个空项目
- 在项目中添加 `Puerts`
    - [下载 Puerts](https://github.com/Tencent/puerts/tags)
    - 解压并将 `Puerts` 目录复制到项目的 `Assets/` 目录下，即：`Assets/Puerts/`
    - 注意：由于 `Puerts` 支持多系统多平台，需要手动指定好哪些文件适用于哪些平台，否则可能运行或编译出现异常，具体操作方法如下：
        - UnityEditor的资源管理器中找到: `Assets` -> `Puerts` -> `Plugins` -> `xx系统` -> `xx` 直到具体的文件，选中目录下所有文件
        - 然后在 `Inspector` 面板勾选对上的平台并点击 `Apply` 按钮（至少保证当前 Editor 环境有选择对，其它如果不知道则全都不选就好，之后等需要编译对应平台的时候再来这里设置）
        - 设置完之后，建议关掉 UnityEditor 重开一次
    - [下载 PuertsWebGL](https://github.com/zombieyang/puerts_unity_webgl_demo/tags) 并解压
    - 在解压目录内找到 `package` 目录并重命名为 `PuertsWebGL`
    - 将重命名好的 `PuertsWebGL` 目录复制到项目的 `Assets/` 目录下，即：`Assets/PuertsWebGL/`
- 在项目中添加 `微信小游戏转换工具`（无需支持 Web、微信小游戏可以忽略）
    - [下载微信小游戏转换工具Unity插件](https://game.weixin.qq.com/cgi-bin/gamewxagwasmsplitwap/getunityplugininfo?download=1)
    - 双击 `minigame.xxx.unitypackage` 将插件导入到项目
- 初始化 `Puerts` 项目
    - 终端进入到创建好的 `Unity项目` 目录中
    - 终端执行 `puer init` 初始化一个 `Puerts` 项目
 - 将项目色彩空间改为 `Gamma`（无需支持 Web、微信小游戏可以忽略）
    - UnityEditor菜单 -> `Editor` -> `Project Settings` -> `Player` -> `Other Settings` -> `Color Space` -> `Gamma`
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


## 编译为Web或微信小游戏工程

- 导出 Web 或 微信小游戏工程
    - 确保 UnityEditor 有安装 Unity-WebGL-Support
    - 确保项目已经有安装 `PuertsWebGL`、`微信小游戏转换工具`
    - 切换编译平台为 WebGL，并确保添加需要导出的 Scene
        - UnityEditor 打开需要导出的场景
        - UnityEditor菜单 `File` -> `Build Settings` -> `WebGL` -> `Switch Platform`
        - UnityEditor菜单 `File` -> `Build Settings` -> `Add Open Scenes`
    - UnityEditor菜单 `微信小游戏` -> `转换小游戏` 在弹出的转换窗口中填写以下信息
        - 游戏appid，[在微信公众平台中申请](https://mp.weixin.qq.com/)
        - 小游戏项目名称，随便填写
        - 游戏资源CDN，填写 `http://localhost:10000`（这也是 cli 工具默认的 Web 项目预览地址，CDN资源也就是这里的资源）
        - 导致路径，这里建议与 `puer.config.js` 中的 `minigameOutputDir` 配置项目保持一致
            - `puer.config.js` 文件在执行 `puer init` 时会自动创建，文件默认位置：`项目/TS/puer.config.js`
            - `minigameOutputDir` 默认为 `桌面/项目目录名称/`
        - 点击 `导出WEBGL并转换为小游戏（常用按钮）` 导出项目
            - 如果导出遇到错误，请根据 UnityEditor Console 面板中的提示排除故障
- 编译 puerts 运行时并对接
    - 终端 `cd Unity项目目录`
    - 终端 `puer build --target minigame --browse`
        - 脚手架会编译 `puerts运行时` 以及项目中的 `TS` 并自动接好相关入口
        - 不出意外终端会输出浏览器预览地址，直接访问即可预览效果
        - 如果 `puer.config.js` 中的 `minigameOutputDir` 配置项与 `微信小游戏转换工具` 导出目录不一致则需要根据提示自行手动接入

> 建议：微信小程序、小游戏技术生态都是基于Web之上的，所以要先保证浏览器上可正常运行，之后再打开小游戏工程来预览调试

## 参与开发

参与改进本工具或二次开发本请阅读 [Developer Guide](./DEVELOP.md)。

## 补充说明

- 建议使用 `PuerTS_Nodejs` 运行时，因为可以直接使用 `Node` 现成的模块
    - 注意：引入 node_modules、node 自带模块，请使用 `require` 方法引入
        - PuerTS目前未实现完整 `import` 支持，`import` 目前只支持本地模块
        - 项目要兼容 `Web`、`微信小游戏`，使用 `Node` 模块需要自行处理好兼容
- 着色器对 WebGL 做兼容支持
- 不建议直接使用引擎自带资源，例如：`Shader.Find("Particles/Standard Unlit")`
- 引入相对模块请以 `./`、`../` 开头，否则编译器可能无法找到模块

## 项目发起者

Tencent [@zombieyang](https://github.com/zombieyang)、4399 Game [@sbfkcel](https://github.com/sbfkcel)

## 相关项目及资料

- [Puerts](https://github.com/Tencent/puerts)
- [puerts_unity_demo](https://github.com/chexiongsheng/puerts_unity_demo)
- [puerts_unity_webgl_demo](https://github.com/zombieyang/puerts_unity_webgl_demo)
- [minigame-unity-webgl-transform](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform)
- [微信小游戏开发者文档-快速上手](https://developers.weixin.qq.com/minigame/dev/guide/)
- [Unity WebGL 微信小游戏适配](https://developers.weixin.qq.com/minigame/dev/guide/game-engine/unity-webgl-transform.html)
