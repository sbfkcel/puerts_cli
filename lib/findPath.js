import getPathInfo from "./getPathInfo.js";
import fs from 'fs-extra';
import typeof2 from './typeof2.js';
import path from 'path';
const cloneRegExp = regExp => new RegExp(regExp.source,regExp.flags);
/**
 * 
 * @param {string} srcPath 输入目录
 * @param {array} matchArrs 需要查找的文件规则（可多个）
 * @param {string} type dir或file，返回文件路径还是目录路径
 * @param {boolean} isAll 是否返回全部匹配到的结果
 * @param {regExp}  ignore  忽略规则
 * @return {string} 文件或目录路径
 */
const findPath = (srcPath,matchArrs,type,isAll,ignore)=>{
    isAll = isAll || false;
    let result = isAll ? [] : undefined,
        eachDir;
    type = type || 'dir';

    // 遍历目录，检查到
    (eachDir = (dir) => {
        let dirPathInfo = getPathInfo(dir),
            temp = false,
            dirName = path.basename(dir);
        if(dirPathInfo.type === 'dir' && !(ignore && ignore.test(dirName))){
            temp = false;
            let dirItems = fs.readdirSync(dir);
            for(let i=0,len=dirItems.length; i<len; i++){
                let item = dirItems[i],
                    itemPath = path.join(dir,item),
                    itemPathInfo = getPathInfo(itemPath);
                if(itemPathInfo.type === 'dir' && (isAll || result === undefined)){
                    eachDir(itemPath);
                }else{
                    for(let _i=0,_len=matchArrs.length; _i<_len; _i++){
                        let _item = matchArrs[_i],
                            _itemType = typeof2(_item).type;
                        
                        if(_itemType === 'regexp'){
                            _item = cloneRegExp(_item);
                        };

                        temp = (_itemType === 'string' && item === _item) ||
                            (_itemType === 'regexp' && _item.test(item)) || 
                            (_itemType === 'function' && _item(item,itemPath));

                        if(temp){
                            let itemRes = type === 'dir' ? dir : itemPath;
                            if(isAll){
                                result.push(itemRes);
                            }else{
                                result = itemRes;
                                return;
                            };
                            temp = false;
                        };
                    };
                };
                
            };
        };
    })(srcPath);
    return result;
};

export default findPath;