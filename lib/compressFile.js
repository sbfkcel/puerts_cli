
import swc from '@swc/core';
import fs from 'fs-extra';

export default (srcPath,outPath)=>{
    const code = fs.readFileSync(srcPath,'utf-8');
    const miniCode = swc.minifySync(code);
    fs.writeFileSync(outPath,miniCode.code);
    console.log("文件压缩成功：",srcPath);
}