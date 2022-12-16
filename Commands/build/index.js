import path from 'node:path';
import fs from 'fs-extra';
import buildForBrowser from "./buildForBrowser.js";
import buildForMinigame from "./buildForMinigame.js";
import buildForApp from './buildForApp.js';
import introduceRes from './introduceRes.js';
import createServer from '../../lib/createServer.js';

const lang = createLang({
    install:{
        cn:'正在尝试安装默认依赖',
        en:'Attempting to install default dependencies'
    },
    installFailed:{
        cn:`依赖安装失败，请确保网络连接正常后手动执行 'npm install'`,
        en:`Dependent installation failed. Please manually execute 'npm install' after ensuring that the network connection is normal`
    }
});
const build = async(argObj)=>{
    const {param,config} = argObj;
    if(param['clear']){                                                                             // 移除当前依赖并重新拉取依赖
        const nodeModulesPath = path.join(config.tsProjectDir,'node_modules');
        fs.removeSync(nodeModulesPath);
        try {                                                                                       // 尝试安装依赖并创建 node_modules 目录软链
            console.log(lang('install'));
            spawnSync('npm',['install','--prefix',config.tsProjectDir]);
        } catch (error) {
            console.log(lang('installFailed'));
        };
    };
    if(param.target && param.target.at(-1) === 'minigame'){
        const miniGameOutDir = config.minigameOutputDir;
        await buildForBrowser(argObj);
        await buildForMinigame(argObj);
        introduceRes(miniGameOutDir);                                                               // 尝试在index.html、game.js中引入编译结果
        if(param.browse && param.browse.at(-1)){                                                    // 有启动预览参数则尝试启用一个静态服务
            const port = param.port.at(-1) || 10000;
            createServer(path.join(miniGameOutDir,'webgl'),port);
        };
    }else{
        buildForApp(argObj);
    };
};

export default build;