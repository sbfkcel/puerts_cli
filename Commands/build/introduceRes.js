import path from 'node:path';
import fs from 'node:fs';
import getPathInfo from '../../lib/getPathInfo.js';
import createLang from '../../lib/createLang.js';
import line from '../../lib/getLine.js';

const lang = createLang({
    notExist:{
        cn:'未找到 %s 文件',
        en:'%s file not found'
    },
    htmlTips:{
        cn:'请使用小程序编译结果后在 %s </head> 之前插入以下代码：',
        en:'Please use the applet to compile the result and insert the following code before %s </head>:'
    },
    jsTips:{
        cn:'请使用小程序编译结果后在 %s 中插入以下代码：',
        en:'Please use the applet to compile the result and insert the following code in %s:'
    }
})

/**
 * 在小程序输出结果中引入编译结果
 * @param {string} outDir 小程序工具结果输出目录
 */
const introduceRes = (outDir)=>{
    const htmlPath = path.join(outDir,'webgl','index.html');
    const htmlPathInfo = getPathInfo(htmlPath);
    const htmlCode = `<script src="./puerts-runtime.js"></script><script src="./puerts_browser_js_resources.js"></script>`;
    if(htmlPathInfo.type === 'file'){
        let htmlStr = fs.readFileSync(htmlPath,'utf-8');
        if(htmlStr.indexOf('puerts-runtime.js') < 0){
            htmlStr = htmlStr.replace(`</head>`,`    ${htmlCode}\n</head>`);
            fs.writeFileSync(htmlPath,htmlStr);
        };
    }else{
        console.log(line);
        console.log(lang('notExist'),htmlPath);
        console.log(lang('htmlTips'),htmlPath);
        console.log(htmlCode);
    };

    const gameJsPath = path.join(outDir,'minigame','game.js');
    const gameJsPathInfo = getPathInfo(gameJsPath);
    const jsCode = `import "./puerts-runtime";`;
    if(gameJsPathInfo.type === 'file'){
        let gameJsStr = fs.readFileSync(gameJsPath,'utf-8');
        if(gameJsStr.indexOf('./puerts-runtime') < 0){
            gameJsStr = (()=>{
                let arr = gameJsStr.split(/\n/);
                a:for(let i=0,len=arr.length; i<len; i++){
                    let item = arr[i];
                    if(item.indexOf('import') < 0){
                        arr.splice(i,0,jsCode);
                        break a;
                    };
                };
                return arr.join('\n');
            })();
            fs.writeFileSync(gameJsPath,gameJsStr);
        };
    }else{
        console.log(line);
        console.log(lang('notExist'),gameJsPath);
        console.log(lang('jsTips'),gameJsPath);
        console.log(jsCode);
    };
}

export default introduceRes;