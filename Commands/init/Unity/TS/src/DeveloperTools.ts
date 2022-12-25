const System:any = CS.System;
const Puerts:any = CS.Puerts;
const UnityEngine:any = CS.UnityEngine;

// HotReload 端口号存储
((puer:any)=>{
    const jsEnvs:any = Puerts.JsEnv.jsEnvs;
    const debugPorts = (()=>{
        let result = '';
        for(let i=0,len=jsEnvs.Count; i<len; i++){
            const item = jsEnvs.get_Item(i);
            if(item && item.debugPort !== -1){
                result += `${item.debugPort},`;
            };
        };
        if(result.length){
            result = result.slice(0,-1);
        };
        return result;
    })();
    const path = System.IO.Path.Combine(UnityEngine.Application.dataPath,'.puertsVmDebugPorts.txt');
    const sw = new System.IO.StreamWriter(path);
    sw.Write(debugPorts);
    sw.Flush();
    sw.Close();
})(global.puer);

// SourceMaps 支持
((puer:any)=>{
    // 增加 path、fs 模块支持
    puer.registerBuildinModule('path', {
        dirname(path) {
            return System.IO.Path.GetDirectoryName(path);
        },
        resolve(dir, url) {
            url = url.replace(/\\/g, '/');
            while (url.startsWith('../')) {
                dir = System.IO.Path.GetDirectoryName(dir);
                url = url.substr(3);
            }
            return System.IO.Path.Combine(dir, url);
        },
    });
    puer.registerBuildinModule('fs', {
        existsSync(path) {
            return System.IO.File.Exists(path);
        },
        readFileSync(path) {
            return System.IO.File.ReadAllText(path);
        },
    });
    
    // 由于目前 puerts 版本引入 node_modules 不支持 import 方式，并且 source-map-support 扩展依赖 fs、path 模块
    const sourceMapSupport = require('source-map-support');

    // 处理文件关系（source-map-support） 依赖上面的文件
    sourceMapSupport.install({
        retrieveSourceMap:function(source){
            let mapFile = source+'.map';
            if (System.IO.File.Exists(mapFile)) {
                return {
                    url: source,
                    map: System.IO.File.ReadAllText(mapFile)
                };
            };
            return null;
        }
    });
})(global.puer);
