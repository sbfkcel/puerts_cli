import fs from 'node:fs';
import path from 'node:path';
import dgram from 'node:dgram';
import getPathInfo from '../../lib/getPathInfo.js';
import isTsAndJs from '../../lib/isTsAndJs.js';
import buildFile from '../../lib/buildFile.js';
import line from '../../lib/getLine.js';
import createLang from '../../lib/createLang.js';
import createDebugers from '../../lib/createDebugers.js';

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

const dev = (argObj)=>{
    const {config,param} = argObj;
    const option = {recursive:true};
    const debugers = createDebugers(param.reload);
    const fun = (eventType, fileName)=>{
        const filePath = path.join(config.tsProjectSrcDir,fileName),
            filePathInfo = getPathInfo(filePath);
        if(filePathInfo.type === 'file' && isTsAndJs(filePath)){
            const outPath = filePath
                .replace(config.tsProjectSrcDir,config.tsOutputDir)
                .replace(/\.(jsx|js|ts)$/,'.js');
            clearTimeout(timer[filePath]);
            timer[filePath] = setTimeout(()=>{
                try {
                    buildFile(filePath,outPath);
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