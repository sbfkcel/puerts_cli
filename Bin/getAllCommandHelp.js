import fs from 'node:fs';
import path,{ dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import alignString from '../lib/alignString.js';
import getPathInfo from '../lib/getPathInfo.js';
import createLang from '../lib/createLang.js';
import adaptPath from '../lib/adaptPath.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const commandsDir = path.join(__dirname,'..','Commands');
const commands = fs.readdirSync(commandsDir);

const lang = createLang({
    commands:{
        cn:'任务列表：',
        en:'Command List:'
    }
});
const getAllCommandHelp = async ()=>{
    let result = `${lang('commands')}\n`;
    for(let i=0,len=commands.length; i<len; i++){
        const item = commands[i];
        const itemHelpPath = path.join(commandsDir,item,'help.js');
        const itemHelpPathInfo = getPathInfo(itemHelpPath);
        if(itemHelpPathInfo.type === 'file'){
            const itemHelp = (await import(adaptPath(itemHelpPath))).default;
            const desLang = createLang({des:itemHelp.des});
            result += `    ${alignString(item,10)} ${desLang('des')}\n`;
        };
    };
    return result;
}
export default getAllCommandHelp;