import path,{ dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import helpToString from './helpToString.js';
import createLang from '../lib/createLang.js';
import getAllCommandHelp from './getAllCommandHelp.js';
import adaptPath from '../lib/adaptPath.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 获取完整的key字符
 * @param {string} str 帮助 params key
 * @returns 
 */
const getFullKey = str => {
    const arr = str.split(',');
    return arr.length > 1 ? arr[1].slice(2) : arr[0].slice(2);
}

/**
 * 获取与任务帮助参数相对应的
 * @param {object} params 任务参数帮助对象
 * @param {string} item 任务参数所对象的 key
 * @returns object
 * - key string 参数完整 key
 * - param object 与参数 key 所对应的 param
 */
const getParam = (params,item)=>{
    for(let key in params){
        const arr = key.split(',');
        if(arr.indexOf(item) > -1){
            const param = params[key];
            return {key:getFullKey(key),param};
        };
    };
    return {};
}

const lang = createLang({
    invalidCommand:{
        cn:'为无效的命令',
        en:'is an invalid command'
    },
    invalidParam:{
        cn:'为无效的命令参数',
        en:'is an invalid command parameter'
    }
})

/**
 * 格式化终端参数
 * @param {string} params 任务名称
 * @param {array} params 终端数组
 * @returns object|string   如果返回字符串则说明参数传入有误
 */
const formatParam = async (command,params)=>{
    const result = {};
    const helpPath = path.join(__dirname,'..','Commands',command,'help.js');
    let helpObj;
    try {
        helpObj = (await import(adaptPath(helpPath))).default
    } catch (error) {
        const allCommandHelp = await getAllCommandHelp();
        return `'${command}' ${lang('invalidCommand')}\n\n${allCommandHelp}`;
    };
    const helpString = helpToString(helpObj);
    let key,param,msg,checkRes;
    for(let i=0,len=params.length; i<len; i++){
        let item = params[i];
        const isKey = item.slice(0,1) === '-';                                                      // 判断参数是否为 key
        const handleKey = ()=>{                                                                     // 处理 key 方法
            let itemVal;
            item = (()=>{                                                                           // 参考到参数和值合并传入的类型，例如：--target=pc
                const index = item.indexOf('=');
                if(index > -1){
                    itemVal = item.slice(index+1);
                    return item.slice(0,index);
                };
                return item;
            })();
            const paramObj = getParam(helpObj.params,item);
            param = paramObj.param;
            if(
                itemVal === undefined &&                                                            // 说明值不是合并传入
                param &&                                                                            // 说明有传入参数
                typeof param.default === 'boolean' &&                                               // 说明默认缺省值有设置，且为 boolean 类型
                (params[i+1] === undefined || params[i+1].slice(0,1) === '-')                       // 说明下个一参数不是值类型
            ){
                itemVal = true;
            };
            key = paramObj.key;
            if(param === undefined){                                                                // 参数错误，给出提示消息
                msg = `'${item}' ${lang('invalidParam')}\n\n`;
                msg += helpString;
                return msg;
            };
            result[key] = key === 'help' ? helpString : result[key] || [];                          // 如果用户输入是帮助参数，则返回帮助信息即可
            if(itemVal !== undefined){                                                              // 校验与参数合并传入的值
                return handleVal(itemVal);
            };
        };
        const handleVal = item => {                                                                 // 处理值方法
            const val = typeof param.format === 'function' ? param.format(item) : item;
            const checkVal = typeof param.check === 'function' ? param.check(val) : null;
            if(checkVal){
                const checkValMsg = createLang({msg:checkVal});
                msg = `${checkValMsg('msg')}\n\n`;
                msg += helpString;
                return msg;
            };
            if(result[key].push){
                result[key].push(val);
            };
        };
        if(isKey){                                                                                  // 校验 key 的合法性
            checkRes = handleKey();
            if(checkRes){
                return checkRes;
            };
        }else{                                                                                      // 校验值的合法性
            checkRes = handleVal(item);
            if(checkRes){
                return checkRes;
            };
        };
    };

    for(const key in helpObj.params){                                                               // 遍历设置缺省默认值
        const param = helpObj.params[key];
        const fullKey = getFullKey(key);
        if((
            result[fullKey] === undefined || result[fullKey].length === 0) && 
            param.default !== undefined
        ){
            result[fullKey] = [param.default];
        };
    };
    return result;
}

export default formatParam;