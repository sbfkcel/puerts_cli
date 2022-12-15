import swc from '@swc/core';
import fs from 'fs-extra';
import path from 'path';
import getPathInfo from './getPathInfo.js';
import createLang from './createLang.js';

const lang = createLang({
    'success':{
        cn:'编译成功：',
        en:'Compiled successfully:'
    }
});
export default (srcPath, outPath, options={}) => {
    const srcPathInfo = getPathInfo(srcPath);
    if(srcPathInfo.type !== 'file'){
        return;
    };

    // 根据参数调整编译参数
    const tsTransformOption = Object.assign({
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: true
            },
            target: "es2020",
            loose: false,
            minify: {
                compress: false,
                mangle: false
            },
            preserveAllComments: true
        },
        module: {
            type: "es6"
        },
        minify: false,
        isModule: true,
        sourceMaps: true
    },options);

    const js = swc.transformFileSync(srcPath,tsTransformOption);                                    // 先将TS转换为JS

    // 该正则通过 import、from 关键字来匹配模块路径
    const re = /((^import|\nimport|\simport)(\s*)(\(*)('|")(\.|\/)([^'"]*)('|")(\)*))|((( from )('|")(\.|\/))([^'"]*)('|"))/g;
    // console.log(js);
    js.code = js.code.replace(re,item=>{                                                            // 替换 JS 代码中模块引用，以增加扩展名
        const itemPath = (()=>{
            const matchArr = item.match(/('|")([^'"]*)('|")/);
            if(matchArr && matchArr[2] !== undefined){
                return matchArr[2];
            };
        })();
        if(path.extname(itemPath) === ""){                                                          // 没有扩展名则添加上扩展或
            return `${item.slice(0,-1)}.js${item.slice(-1)}`;
        };
        return item;
    });
    const dirPath = path.dirname(outPath);
    fs.ensureDirSync(dirPath);
    if(js.map){
        js.code += `\n//# sourceMappingURL=${path.parse(outPath).base}.map`;
        fs.writeFileSync(`${outPath}.map`,js.map);
    };
    fs.writeFileSync(outPath,js.code);
    console.log(`${lang('success')}${srcPath}`);
}