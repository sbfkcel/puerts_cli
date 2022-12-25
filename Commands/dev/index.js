import fs from 'node:fs';
import path from 'node:path';
import getPathInfo from '../../lib/getPathInfo.js';
import isTsAndJs from '../../lib/isTsAndJs.js';
import buildFile from '../../lib/buildFile.js';
import line from '../../lib/getLine.js';
import createLang from '../../lib/createLang.js';
import createDebugers from '../../lib/createDebugers.js';
import findPath from '../../lib/findPath.js';

const timer = {};
const lang = createLang({
    'failed':{
        cn:'编译失败：',
        en:'Compilation failed'
    },
    'tip':{
        cn:'已开启 TS 文件监听，现在修改项目文件将自动完成编译',
        en:'The TS file monitoring has been turned on, and now modifying the project file will automatically complete the compilation'
    }
});

const getDebugers = async (workPath)=>{
    const vmDebugPortsPath = findPath(workPath,[/^\.puertsVmDebugPorts\.txt$/],'file',false);
    if(vmDebugPortsPath === undefined){
        return;
    };
    const vmDebugPortsPathInfo = getPathInfo(vmDebugPortsPath);
    if(vmDebugPortsPathInfo.type === 'file'){
        const vmDebugPortsArr = (()=>{
            const result = [];
            const str = fs.readFileSync(vmDebugPortsPath,'utf-8');
            str.split(',').forEach(item => {
                result.push(+item);
            });
            return result;
        })();
        return await createDebugers(vmDebugPortsArr);
    };
};

const dev = async(argObj)=>{
    const {config,param,workObj} = argObj;
    let debugers = await getDebugers(workObj.path);
    const option = {recursive:true};
    const fun = (eventType, fileName)=>{
        const filePath = path.join(config.tsProjectSrcDir,fileName),
            filePathInfo = getPathInfo(filePath);
        if(filePathInfo.type === 'file' && isTsAndJs(filePath)){
            const outPath = filePath
                .replace(config.tsProjectSrcDir,config.tsOutputDir)
                .replace(/\.(jsx|js|ts)$/,'.js');
            clearTimeout(timer[filePath]);
            timer[filePath] = setTimeout(async()=>{
                try {
                    buildFile(filePath,outPath);
                    if(debugers === undefined || debugers.size === 0){
                        debugers = await getDebugers(workObj.path);
                    };
                    if(debugers){
                        debugers.forEach(async(item)=>{
                            try {
                                if(!item.client){
                                    await item.init();
                                };
                                item.update(outPath);
                            } catch (error) {
                                console.log(error);
                            };
                        });
                    };
                } catch (error) {
                    console.log(error);
                    console.log(lang('failed'),filePath);
                };
            },200);
        };
    };
    fs.watch(config.tsProjectSrcDir,option,fun);
    console.log(lang('tip'));
    console.log(line);
};

export default dev;