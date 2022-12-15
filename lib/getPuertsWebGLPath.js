import path from 'node:path';
import findPath from './findPath.js';
import createLang from './createLang.js';

const lang = createLang({
    notExist:{
        cn:'未在您的项目目录中发现 PuertsWebGL 目录',
        en:'PuertsWebGL directory not found in your project directory'
    }
})
/**
 * 查找项目中 PuertsWebGL PuertsDLLMock 所存放的路径
 * @param {string} srcDir unity 项目目录路径
 * @return string 查找到的 PuertsWebGL 目录路径
 */
export default srcDir=>{                                                                            // 通过文件匹配到 puertsWebGL 所在的目录
    const match1 = (item,itemPath) => {
        if(
            item === 'setToInvokeJSArgument.ts' &&                                                  // 根据 'setToInvokeJSArgument.ts' 文件来定位路径
            path.basename(path.dirname(itemPath)) === 'mixins'                                      // 确定文件是在 mixins 目录下
        ){
            return true;
        };
    };
    const find = findPath(srcDir,[match1],'dir',false,/(^(node_modules)$)|(^\.)/i);
    if(find){
        return path.join(find,'..');
    }else{
        throw new Error(`${lang('notExist')} -> ${srcDir}`);
    };
};