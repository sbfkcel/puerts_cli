import path, { sep } from 'node:path';
import fs from 'fs-extra';
import getPuertsPath from '../../lib/getPuertsPath.js';
import getFilesPath from '../../lib/getFilesPath.js';
import getPathInfo from '../../lib/getPathInfo.js';
import buildRunTime from './buildRunTime.js';
import ignore from './ignore.js';
import startSymbol from './startSymbol.js';
import buildForApp from './buildForApp.js';

/**
 * 将项目文件、Puerts 运行时编译为小程序支持
 * @param {object} argObj 参数对象，包含用户所传入的参数、配置信息、工程信息、当前执行命令的路径等
 */
const buildForMinigame = async function(argObj){
    const {param,config,workObj} = argObj;
    const minigameOutputDir = config.minigameOutputDir;
    const srcDir = workObj.path;
    let outputDir = path.join(minigameOutputDir,'minigame');

    if(param && param.clear && param.clear.at(-1)){                                                 // 清理逻辑
        fs.removeSync(path.join(outputDir,'puerts-runtime.js'));
        fs.emptyDirSync(path.join(outputDir,'puerts_minigame_js_resources'));
    };

    const buildOptions = (()=>{
        const result = {};
        if(param && param.minify !== undefined){
            result.minify = param.minify.at(-1);
        };
        if(param && param.sourcemap !== undefined){
            result.sourceMaps = param.sourcemap.at(-1);
        };
        return result;
    })();
    await buildRunTime(srcDir,outputDir,buildOptions);

    const tsProjectSrcDir = config.tsProjectSrcDir;
    const tsOutputDir = config.tsOutputDir;
    fs.emptyDirSync(tsOutputDir);
    buildForApp(argObj);

    const puertsPath = getPuertsPath(srcDir);
    outputDir = path.join(outputDir,'puerts_minigame_js_resources');                                // 微信小游戏中 require 会在该目录下寻找模块
    fs.emptyDirSync(outputDir);

    const resourcesPath = path.join(srcDir, 'Assets', 'Resources');
    const jsList = (()=>{
        const puertsFiles = getFilesPath(puertsPath, null, ignore);                                 // 获取 Puerts 下要打包的文件
        const resourcesFiles = getFilesPath(config.tsOutputDir, null, ignore);
        return [...puertsFiles,...resourcesFiles];
    })();
    const jsFiles = (()=>{
        const result = {};
        for (let i = 0, len = jsList.length; i < len; i++) {
            const item = jsList[i];
            const start = (()=>{
                const index = item.indexOf(startSymbol);
                return index > -1 ? index : 0;
            })();
            const itemRelativePath = (()=>{                                                         // 得到相对路径
                let result;
                if(item.indexOf(config.tsOutputDir) > -1){                                          // 处理项目本身的JS路径
                    result = item.replace(config.tsOutputDir,'');
                }else{
                    result = `${item.slice(start + startSymbol.length).split(sep).join('/')}`;      // 得到puerts本身的路径
                };
                result = result.replace(/\.(mjs|cjs|es6|es)$/i, '.js');                             // 处理JS相关扩展名
                while(result[0] === path.sep){
                    result = result.slice(1)
                };
                return result;
            })();
            const re = new RegExp(`sourceMappingURL=${path.basename(item)}.map`,'g');
            const code = (()=>{
                let str = fs.readFileSync(item,'utf-8');
                return str.replace(re,`sourceMappingURL=${path.basename(itemRelativePath)}.map`)
            })();
            result[itemRelativePath] = code;
            const itemMapPath = `${item}.map`;                                                      // 如果有 map 文件也一并加入到输出目录
            const itemMapPathInfo = getPathInfo(itemMapPath);
            if(itemMapPathInfo.type === 'file'){
                result[`${itemRelativePath}.map`] =  itemMapPath;
            };
        };
        return result;
    })();

    for(let key in jsFiles){
        const outPath = path.join(outputDir,key);
        const outDir = path.dirname(outPath);
        fs.ensureDirSync(outDir);
        fs.writeFileSync(outPath,jsFiles[key]);
    };
};

export default buildForMinigame;