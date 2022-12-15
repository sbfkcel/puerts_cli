import fs from 'fs';
import path from 'path';
import getPathInfo from "./getPathInfo.js";
/**
 * 获取指定路径目录下所有文件列表
 * @param {string} dirPath  <必选> 目录路径
 * @param {array} result    <可选> 将结果往哪个队列中添加（用于内部循环调用） 
 * @param {function} ignore [可选] 忽略
 * @returns array 文件列表
 */
 const getFilesPath = (dirPath,result,ignore)=>{
    result = result || [];
    const isDir = fs.statSync(dirPath).isDirectory();
    if(isDir){
        let items = fs.readdirSync(dirPath);
        items.forEach(item => {
            let itemPath = path.join(dirPath,item);
            if(typeof ignore === 'function' && ignore(item,itemPath)){
                return;
            };
            switch (getPathInfo(itemPath).type) {
                case 'file':
                    result.push(itemPath);
                break;
                case 'dir':
                    getFilesPath(itemPath,result,ignore);
                break;
            }
        });
    }else{
        throw new Error("传入的不是有效的目录路径");
    };
    return result;
}
export default getFilesPath;