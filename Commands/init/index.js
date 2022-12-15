import fs from 'fs-extra';
import path,{ dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import findPath from '../../lib/findPath.js';
import createLang from '../../lib/createLang.js';
import getConfig from '../../Bin/getConfig.js';
import line from '../../lib/getLine.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const lang = createLang({
    create:{
        cn:'创建文件：',
        en:'create:'
    },
    success:{
        cn:'恭喜，已初始化成功。打开 Assets/Scenes/App.unity 预览',
        en:'Congratulations, the initialization has been successful. Open Assets/Scenes/App.unity preview'
    },
    existed:{
        cn:'项目已初始化，如需重新初始化请使用 --force 参数强行执行（注意：该操作将覆盖已有文件）',
        en:'The project has been initialized. If you need to re-initialize, please use the --force parameter to force it (note: this operation will overwrite existing files)'
    },
    install:{
        cn:'正在尝试安装默认依赖',
        en:'Attempting to install default dependencies'
    },
    installFailed:{
        cn:`依赖安装失败，请确保网络连接正常后手动执行 'npm install'`,
        en:`Dependent installation failed. Please manually execute 'npm install' after ensuring that the network connection is normal`
    }
});

const init = async(argObj)=>{
    const {param,config,workObj} = argObj;
    if(config.msg === undefined && param.force.at(-1) === false){                                   // msg 为 undefined 说明项目初始化过且未带强制执行参数的话则不允许向下执行
        console.log(lang('existed')); 
        return;
    };
    const {type} = workObj;
    const tplDir = path.join(__dirname,`${type.slice(0,1).toLocaleUpperCase()}${type.slice(1)}`);
    const tplFiles = findPath(tplDir,[/^[^\.]/],'file',true,/(^\.)|^(node_modules)$/);

    for(let i=0,len=tplFiles.length; i<len; i++){                                                   // 拷贝所有模版文件
        const item = tplFiles[i];
        const itemOutPath = item.replace(tplDir,workObj.path);
        const itemOutDir = path.dirname(itemOutPath);
        fs.ensureDirSync(itemOutDir);
        fs.copyFileSync(item,itemOutPath);
        console.log(`${lang('create')}${itemOutPath}`);
    };
    const puerConfig = await getConfig(workObj.path);                                               // 读取配置信息
    // console.log(puerConfig,argObj);
    fs.emptydirSync(puerConfig.tsOutputDir);                                                        // 保证输出目录存在
    fs.createSymlinkSync(                                                                           // 创建 package.json 软链
        path.join(puerConfig.tsProjectDir,'package.json'),
        path.join(puerConfig.tsOutputDir,'package.json')
    );
    console.log(line);
    try {                                                                                           // 尝试安装依赖并创建 node_modules 目录软链
        console.log(lang('install'));
        spawnSync('npm',['install','--prefix',puerConfig.tsProjectDir]);
        fs.createSymlinkSync(
            path.join(puerConfig.tsProjectDir,'node_modules'),
            path.join(puerConfig.tsOutputDir,'node_modules')
        );
    } catch (error) {
        console.log(lang('installFailed'));
    };
    console.log(line);
    console.log(lang('success'));
};

export default init;