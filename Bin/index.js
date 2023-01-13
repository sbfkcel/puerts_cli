#!/usr/bin/env node
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import formatParam from './formatParam.js';
import getAllCommandHelp from './getAllCommandHelp.js';
import getWorkDir from './getWorkDir.js';
import getConfig from './getConfig.js';
import createLang from '../lib/createLang.js';
import getPathInfo from '../lib/getPathInfo.js';
import adaptPath from '../lib/adaptPath.js';

const lang = createLang({
    version:{
        cn:'版本',
        en:'Version'
    },
    unknownCommand:{
        cn:'未知的命令',
        en:'unknown command'
    },
    notFunction:{
        cn:'入口必须向外导出一个函数',
        en:'The entry must export a function'
    }
});
const __dirname = dirname(fileURLToPath(import.meta.url));
(async()=>{
    const cwd = process.cwd();
    const command = process.argv[2];
    const packagePath = path.join(__dirname,'..','package.json');
    const packageObj = JSON.parse(fs.readFileSync(packagePath,'utf-8'));
    if(command === undefined || /^(-h|--help|-v|--version)$/i.test(command)){                       // 未输入命令则返回工具所有帮助信息
        console.log(`${lang('version')} ${packageObj.version}\n`);
        console.log(await getAllCommandHelp());
        return;
    };

    const param = await formatParam(command,process.argv.slice(3));                                 // 格式化参数对象
    if(typeof param === 'string'){                                                                  // 返回字符串则说明参数有误，直接输入帮助信息
        console.log(param);
        return;
    };
    if(param.help){                                                                              // 输出命令帮助
        console.log(param.help);
        return;
    };

    const workObj = getWorkDir(cwd);                                                                // 获取当前项目根目录
    if(workObj.msg){                                                                                // 如果有返回消息，说明有报错，直接输出错误信息
        console.log(workObj.msg);
        return;
    };

    const config = await getConfig(workObj.path);                                                   // 如果获取项目配置返回的是提示，则打印出提示且不再向下执行
    const argObj = {param,config,workObj,cwd};

    const entryPath = path.join(__dirname,'..','Commands',command,'index.js');                      // 拿到每个命令入口文件路径
    const entryPathInfo = getPathInfo(entryPath);

    if(entryPathInfo.type !== 'file'){
        return;
    };

    if(config.msg && command !== 'init'){                                                           // 项目未初始化，且不是初始化指令则不允许向下执行
        console.log(config.msg);
        return;
    };

    const entry = (await import(adaptPath(entryPath))).default;                                     // 得到入口方法
    if(typeof entry !== 'function'){
        console.log(lang('notFunction'));
        return;
    };
    entry(argObj);
})()