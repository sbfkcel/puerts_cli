import alignString from '../lib/alignString.js';
import createLang from '../lib/createLang.js';
const indentation = alignString('',4);                                                              // 缩进

const lang = createLang({
    des:{
        cn:'描述：',
        en:'Describe:'
    },
    param:{
        cn:'参数：',
        en:'Parameter:'
    }
})

/**
 * 将任务帮助对象转为字符串
 * @param {object} obj 帮助对象
 * @returns string
 */
const helpToString = (obj)=>{
    const commandDesLang = createLang({des:obj.des});
    let result = `${lang('des')}\n`;
    result += `${indentation}${commandDesLang('des')}\n`;
    result += `${lang('param')}\n`;
    const params = obj.params;
    for(let key in params){
        const item = params[key];
        const {simple,full} = (()=>{
            const arr = key.split(',');
            const simple = arr.length > 1 ? arr[0] : '';
            const full = arr[arr.length - 1];
            return {simple,full};
        })();
        const paramDesLang = createLang({des:item.des});
        result += `${indentation}${alignString(simple+(simple===''?'':','),4)} ${alignString(full,12)} ${paramDesLang('des')} \n` ;
    };
    return result;
};

export default helpToString;