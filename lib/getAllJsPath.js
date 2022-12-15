import path,{ dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import getPathInfo from "./getPathInfo.js";
import getFiles from "./getFilesPath.js";
import findPath from "./findPath.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sep = path.sep;
const ignore = (item,itemPath)=>{
    if(item === 'node_modules'){                                                                    // 所有 node_modules 可以过滤掉
        return true;
    };
    if(item.slice(0,1) === '.'){                                                                    // 所有以 . 开始的文件过滤掉
        return true;
    };
    const {type,extname} = getPathInfo(itemPath);
    if(type === 'file' && !/^(mjs|cjs|js)$/i.test(extname)){                                        // 是文件类型，但不是 js 文件的过滤掉
        return true;
    };
    if(type === 'file' && itemPath.indexOf(`${sep}Resources${sep}`) < 0){                           // 不在 Resources 的目录也过滤掉
        return true;
    };
};

/**
 * 获 Unity 取项目下所有要用到的 js 文件
 * @param {string} unityProjectDir unity 项目目录路径
 */
const getAllJsPath = (unityProjectDir)=>{
    const result = {};
    const assetsDir = path.join(unityProjectDir,'Assets');
    const assetsDirInfo = getPathInfo(assetsDir);
    const packagesDir = path.join(unityProjectDir,'Packages');
    const packagesDirInfo = getPathInfo(packagesDir);
    if(assetsDirInfo.type !== 'dir' || packagesDirInfo.type !== 'dir'){
        throw new Error(`${unityProjectDir} 不是 unity 工程目录`);
    };
    const puertsDir = (()=>{                                                                        // 获取到项目目录下的 puerts 所在路径
        const match1 = (item,itemPath) => {
            if(
                item === 'GenericDelegate.cs' &&                                                    // 根据 'GenericDelegate.cs' 文件来定位路径
                path.basename(path.dirname(itemPath)) === 'JSType'
            ){
                return true;
            };
        };
        const find = findPath(unityProjectDir,[match1],'dir',false,/(^(node_modules)$)|(^\.)/i);
        if(find){
            return path.join(find,'..','..','..');
        }else{
            throw new Error('未在您的项目目录中发现 PuertsTS 目录');
        };
    })();

    if(puertsDir){                                                                                  // puerts 目录下所有 js 文件
        result[puertsDir] = getFiles(puertsDir,null,ignore);
    };

    const resourcesDir = path.join(assetsDir,'Resources');                                          // Resources 目录下所有 js 文件
    result[resourcesDir] = getFiles(resourcesDir,null,ignore);

    const dllMockDir = path.join(__dirname,'..','PuertsDLLMock');                                   // DllMock 目录下所d有 js 文件 (WebGLPostProcessor.cs 中逻辑，看着好像没什么用)
    result[dllMockDir] = getFiles(dllMockDir,null,ignore);

    return result;
}

// console.log("获得的结果",getAllJsPath(`/Users/fan/Desktop/unity`));

export default getAllJsPath;