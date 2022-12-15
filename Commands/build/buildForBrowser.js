import path, { sep } from 'node:path';
import fs from 'fs-extra';
import swc from '@swc/core';
import getPuertsPath from '../../lib/getPuertsPath.js';
import getFilesPath from '../../lib/getFilesPath.js';
import isTsAndJs from '../../lib/isTsAndJs.js';
import buildRunTime from './buildRunTime.js';
import ignore from './ignore.js';
import startSymbol from './startSymbol.js';
import swcConfig from './swcConfig.js';
import getPathInfo from '../../lib/getPathInfo.js';

/**
 * 将项目文件、Puerts 运行时编译为浏览器支持
 * @param {object} argObj 参数对象，包含用户所传入的参数、配置信息、工程信息、当前执行命令的路径等
 */
const buildForBrowser = async function (argObj) {
    const {param,config,workObj} = argObj;
    const minigameOutputDir = config.minigameOutputDir;
    const srcDir = workObj.path;
    const outputDir = path.join(minigameOutputDir,'webgl');
    const targetPath = path.join(outputDir, 'puerts_browser_js_resources.js');
    if(param && param.clear && param.clear.at(-1)){                                                 // 删除目标文件
        fs.removeSync(targetPath);
        fs.removeSync(path.join(outputDir,'puerts-runtime.js'));
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

    const puertsPath = getPuertsPath(srcDir);
    const tsProjectSrcDir = config.tsProjectSrcDir;
    const transformConfig = Object.assign(swcConfig,buildOptions);
    const jsFiles = await (async() => {
        const result = {};
        const puertsFiles = getFilesPath(puertsPath, null, ignore);                                 // 获取 Puerts 下要打包的文件
        const resEntrys = (() => {                                                                  // 得到项目 TS 要打包的文件入口 
            const result = [];
            fs.readdirSync(tsProjectSrcDir).forEach(item => {
                let itemPath = path.join(tsProjectSrcDir, item);
                if (isTsAndJs(itemPath)) {
                    result.push(itemPath);
                };
            });
            return result;
        })();

        let start = 0;                                                                              // 处理 puerts 打包逻辑
        for (let i = 0, len = puertsFiles.length; i < len; i++) {
            const item = puertsFiles[i];
            start = (()=>{
                const index = item.indexOf(startSymbol);
                return start === 0 && index > -1 ? index : start;
            })();
            const itemPath = `${item.slice(start + startSymbol.length).split(sep).join('/')}`;
            const code = swc.transformSync(fs.readFileSync(item, 'utf-8'), transformConfig).code;
            result[itemPath] = `(function(exports, require, module, __filename, __dirname) {\n${code}\n})`;
        };

        for (let i = 0, len = resEntrys.length; i < len; i++) {                                     // 根据获取到的入口文件打包项目文件
            const item = resEntrys[i];
            const itemOutPath = item.replace(tsProjectSrcDir,config.tsOutputDir)                    // 得到输出路径
                .replace(/\.(jsx|js|ts)$/, '.js');

            const itemRelativePath = (()=>{
                let result = itemOutPath.replace(`${config.tsOutputDir}`, '');
                while(result[0] === path.sep){
                    result = result.slice(1)
                };
                return result;
            })();             // 根据输出路径得到相对路径
            // console.log("相对路径",itemRelativePath,resourcesPath,itemOutPath)
            const bundleRes = await swc.bundle((() => {
                const config = { entry: {}, target:'node' };
                config.entry[itemRelativePath] = item;
                return config
            })());
            const code = swc.transformSync(bundleRes[itemRelativePath].code, transformConfig).code; // 由于导出的结果包含在一个对象里，而 es6 的 export 只能用在顶层，所以这里再将其转成 cmd
            result[itemRelativePath] = `(function(exports, require, module, __filename, __dirname) {\n${code}\n})`
        };
        return result;
    })();
    
    const resCode = (() => {
        let result = '';
        for (let key in jsFiles) {
            result += `"${key}":${jsFiles[key]},\n`;
        };
        return `window.PUERTS_JS_RESOURCES = {\n${result}\n}`;
    })();
    fs.writeFileSync(targetPath, resCode);
};

export default buildForBrowser;