const System:any = CS.System;
const Puerts:any = CS.Puerts;

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
