import fs from 'fs-extra';
import path from 'node:path';
import getFilesPath from '../../lib/getFilesPath.js';
import getPathInfo from '../../lib/getPathInfo.js';
import isTsAndJs from '../../lib/isTsAndJs.js';
import buildFile from '../../lib/buildFile.js';
import line from '../../lib/getLine.js';
import createLang from '../../lib/createLang.js';

const lang = createLang({
    failed:{
        cn:'编译失败：',
        en:'Compilation failed'
    },
    tip:{
        cn:'共 %d 个文件编译完成',
        en:'A total of %d files were compiled'
    }
});
const ignore = (item,itemPath) => {                                                                 // 忽略 node_modules 和所有 . 开头的目录
    if(item === 'node_modules'){
        return true;
    };
    if(item[0] === '.'){
        return true;
    };
};

/**
 * 将项目文件编译为常规应用标准
 * @param {object} argObj 参数对象，包含用户所传入的参数、配置信息、工程信息、当前执行命令的路径等
 */
const buildForApp = (argObj)=>{
    const {param,config,workObj,cwd} = argObj;
    const srcDir = config.tsProjectSrcDir;
    const outDir = config.tsOutputDir;
    if(param.clear.at(-1)){                                                                         // 清理输出目录
        fs.emptyDirSync(outDir);
    };
    const packageLinkPath = path.join(outDir,'package.json');
    const packageLinkPathInfo = getPathInfo(packageLinkPath);
    const nodeModulesPath = path.join(outDir,'node_modules');
    const nodeModulesPathInfo = getPathInfo(nodeModulesPath);
    if(!packageLinkPathInfo.isExist){                                                               // 保证软链存在
        fs.createSymlinkSync(
            path.join(config.tsProjectDir,'package.json'),
            packageLinkPath
        );
    };
    if(!nodeModulesPathInfo.isExist){                                                               // 保证软链存在
        fs.createSymlinkSync(
            path.join(config.tsProjectDir,'node_modules'),
            nodeModulesPath
        );
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
    
    let count = 0;
    const files = getFilesPath(srcDir,null,ignore);
    for(let i=0,len=files.length; i<len; i++){
        const item = files[i];
        if(isTsAndJs(item)){
            let outPath = item.replace(srcDir,outDir).replace(/\.(jsx|js|ts)$/,'.js');
            try {
                buildFile(item,outPath,buildOptions);
            } catch (error) {
                console.log(error);
                console.log(`${lang('failed')}${item}`);
                return;
            };
            count++;
        };
    };
    console.log(line);
    console.log(lang('tip'),count);
};

export default buildForApp;
