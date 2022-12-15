import path from 'node:path';
import getPathInfo from '../lib/getPathInfo.js';
import createLang from '../lib/createLang.js';
import findPath from '../lib/findPath.js';
import adaptPath from '../lib/adaptPath.js';

const lang = createLang({
    msg:{
        cn:`项目未初始化，请使用 'init' 命令来初始化一个 PuerTs 工程`,
        en:`Project not initialized, please use 'init' command to initialize a PuerTs project`
    }
})
const getConfig = async(workDir)=>{
    const configPath = (()=>{
        const dirItems = ['TS','TypeScript','ts','typescript','Puer-Project','puer-project'];       // 尝试在这几个目录中寻找
        for(let i=0,len=dirItems.length; i<len; i++){
            let item = dirItems[i];
            let itemPath = path.join(workDir,item,'puer.config.js');
            let itemPathInfo = getPathInfo(itemPath);
            if(itemPathInfo.type === 'file'){
                return itemPath;
            };
        };
        return findPath(workDir,[/^puer\.confifg\.js$/],'file',false);                              // 如果找不到则尝试从整个项目中去找
    })();
    if(configPath === undefined){
        return {msg:lang('msg')}
    };
    const config = (await import(adaptPath(configPath))).default;
    const dir = path.dirname(configPath);
    for(let key in config){                                                                         // 将相对路径处理成绝对路径，方便后续处理
        let item = config[key];
        let itemParse = path.parse(item);
        if(itemParse.root === ''){
            config[key] = path.join(dir,item);
        };
    };
    config.tsProjectDir = dir;
    return config;
};

export default getConfig;