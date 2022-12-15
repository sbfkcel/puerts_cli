import path from 'node:path';
import findPath from './findPath.js';

/**
 * 查找项目中 Puerts 所存放的路径
 * @param {string} srcDir unity 项目目录路径
 * @return string 查找到的 Puerts 目录路径
 */
export default srcDir=>{                                                                            // 通过文件匹配到 puerts 所在的目录
    const match1 = (item,itemPath) => {
        if(
            item === 'GenericDelegate.cs' &&                                                        // 根据 'GenericDelegate.cs' 文件来定位路径
            path.basename(path.dirname(itemPath)) === 'JSType'                                      // 确定文件是在 JSType 目录下
        ){
            return true;
        };
    };
    const find = findPath(srcDir,[match1],'dir',false,/(^(node_modules)$)|(^\.)/i);
    if(find){
        return path.join(find,'..','..','..');
    }else{
        throw new Error('未在您的项目目录中发现 Puerts 目录 -> ',srcDir);
    };
};