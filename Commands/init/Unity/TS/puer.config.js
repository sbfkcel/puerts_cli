import os from 'node:os';
import path,{ dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectName = path.basename(path.join(__dirname,'..'));

/**
 * puer 脚手架配置
 */
const config = {
    // 配置项目 TS 文件目录
    tsProjectSrcDir: "./src",

    // 配置项目 TS 编译为 JS 所输出的目录（建议不动）
    tsOutputDir: "../Assets/Resources/JS",

    // 配置微信小游戏导出目录
    // - 建议与【微信小游戏转换工具】中的【导出路径】保持一至
    // - PS：这里为了演示方便，默认输出到桌面与项目名称对应的目录下
    minigameOutputDir: path.join(os.homedir(),'Desktop',projectName)
}
export default config;