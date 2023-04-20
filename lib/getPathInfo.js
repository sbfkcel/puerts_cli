import fs from 'node:fs';
import path from 'node:path';

/**
 * 获取目标路径信息
 * @param {string} targetPath  <必选> 目标路径
 * @returns object 路径信息，包含其类型、扩展名、目录名
 */
export default (targetPath)=>{
    const result = {};
    let stat;
    try {
        stat = fs.statSync(targetPath)
    } catch (error) {};
    if(stat){
        result.type = stat.isFile() ? 'file' :
            stat.isDirectory ? 'dir' :
            stat.isSymbolicLink ? 'link' :
            stat.isSocket ? 'socket' :
            'other';
        result.isExist = true;
    };
    result.extname = path.extname(targetPath).slice(1);
    result.dirPath = path.dirname(targetPath);
    return result;
}