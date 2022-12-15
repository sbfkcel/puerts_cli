import path from 'node:path';
import getPuertsWebGLPath from '../../lib/getPuertsWebGLPath.js';
import spack from '../../lib/spack.js';

/**
 * 打包 PuertsWebGL PuertsDLLMock 为 puerts-runtime.js
 * @param {string} srcDir 项目目录
 * @param {string} outputDir 打包结果输出目录
 * @param {object} options 编译选项
 */
const buildRunTime = async (srcDir, outputDir, options = {})=>{
    const {param} = options;
    const puertsWebGLPath = getPuertsWebGLPath(srcDir);
    const config = {
        target:'node',
        entry: {
            "puerts-runtime": path.join(puertsWebGLPath, 'index.ts')
        },
        output: {
            path: outputDir,
            name: '[name].js'
        },
        options
    };
    await spack(config, code => {
        return `(function(global){${code}})(typeof global !== 'undefined' ? global : globalThis || window)`;
    });
}

export default buildRunTime;