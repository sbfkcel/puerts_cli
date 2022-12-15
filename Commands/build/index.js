import path from 'node:path';
import buildForBrowser from "./buildForBrowser.js";
import buildForMinigame from "./buildForMinigame.js";
import buildForApp from './buildForApp.js';
import introduceRes from './introduceRes.js';
import createServer from '../../lib/createServer.js';

const build = async(argObj)=>{
    const {param,config} = argObj;
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