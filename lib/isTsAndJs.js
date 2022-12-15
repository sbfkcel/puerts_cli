import getPathInfo from './getPathInfo.js';

 /**
 * 判断目录路径是否为 TS或JS 文件
 * @param {string} srcPath 输入路径
 * @returns Boolean
 */
export default (targetPath)=>{
    const extName = getPathInfo(targetPath).extname;
    return /^(jsx|js|ts|es|es6)$/i.test(extName) && !/(\.d\.ts)$/i.test(targetPath);
}