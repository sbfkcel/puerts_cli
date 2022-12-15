import swc from '@swc/core';
import fs from 'fs-extra';
import path from 'path';

const isUserDefinedEntry = (config,name) => {                                                       // 用于判断是否为用户定义入口
    if (typeof config.entry === 'string') {
        return config.entry === name;
    };
    if (Array.isArray(config.entry)) {
        for (const e of config.entry){
            if (e === name) {
                return true;
            }
        }
        return false;
    };
    return name in config.entry;
};
const spack = async(config,pack)=>{                                                                 // 打包功能参见 https://github.com/swc-project/cli/blob/master/src/spack/index.ts
    const bundle = await swc.bundle(config);
    for(let key in bundle){
        let outPath = '';
        if(isUserDefinedEntry(config,key)){
            outPath = path.join(config.output.path, config.output.name.replace('[name]', key));
        }else{
            const ext = path.extname(key);
            const base = path.basename(key, ext);
            const filename = path.relative(process.cwd(), key);
            outPath = path.join(config.output.path,path.dirname(filename),`${base}.js`);
        };
        const outDir = path.dirname(outPath);
        fs.ensureDirSync(outDir);                                                                   // 确保目录存在
        bundle[key].code = typeof pack === 'function' ? pack(bundle[key].code) : bundle[key].code;
        if (bundle[key].map && config.options.sourceMaps) {                                         // 有输出 source map 则同样保存
            bundle[key].code += `\n//# sourceMappingURL=${path.basename(outPath)}.map`;
            fs.writeFileSync(`${outPath}.map`, bundle[key].map);
        };
        fs.writeFileSync(outPath,bundle[key].code);
    };
};

// 测试代码
// const config = {
//     entry: {
//         web: '/Users/fan/Desktop/build_minigame/PuertsDLLMock/output/index.js' 
//     },
//     output: {
//         path: '/Users/fan/Desktop/build_minigame/.temp',
//         name: '[name].js'
//     }
// };
// spack(config).then(v => {
//     console.log(v);
// }).catch(e => {
//     console.log(e);
// });

export default spack;