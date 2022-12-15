import path from 'node:path';
import getPathInfo from "../lib/getPathInfo.js";
import createLang from '../lib/createLang.js';

const lang = createLang({
    msg:{
        cn:'\n请在游戏项目目录下执行该工具',
        en:'\nPlease execute the tool in the game project directory'
    }
})
const getWorkDir = cwd =>{
    while(path.join(cwd,'..') !== cwd){                                                             // 往上检测，一直检测到根目录为止
        if(
            getPathInfo(path.join(cwd,'ProjectSettings')).type === 'dir' &&
            getPathInfo(path.join(cwd,'Packages')).type === 'dir' && 
            getPathInfo(path.join(cwd,'Library')).type === 'dir'
        ){
            return {type:'unity',path:cwd,name:path.basename(cwd)};
        }else if(
            getPathInfo(path.join(cwd,'Binaries')).type === 'dir' &&
            getPathInfo(path.join(cwd,'Config')).type === 'dir' &&
            getPathInfo(path.join(cwd,'DerivedDataCache')).type === 'dir' &&
            getPathInfo(path.join(cwd,'Saved')).type === 'dir'
        ){
            return {type:'unreal',path:cwd,name:path.basename(cwd)};
        }else{
            cwd = path.join(cwd,'..');
        };
    }
    return {msg:lang('msg')};
}
export default getWorkDir;