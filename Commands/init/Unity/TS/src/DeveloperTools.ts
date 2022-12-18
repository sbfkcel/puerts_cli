const System:any = CS.System;
const Puerts:any = CS.Puerts;

// Hot-Reload 支持
(()=>{
    // Puerts searchModule 有冲突，先这么注册着
    puer.registerBuildinModule('stream',require('node:stream'));
    const CDP = require('chrome-remote-interface');
    const fs = require('fs');
    const crypto = require('crypto');
    const createHash = str => crypto.createHash('md5').update(str).digest('hex');
    enum State {None,Connecting,Open,Close};
    class HotReLoad {
        private client:any;
        private host:string = '127.0.0.1';
        private port:number;
        private debuger:any;
        private state:State;
        private pathMap:Map<string,number> = new Map();
        private idMap:Map<number,string> = new Map();
        constructor(port:number){
            this.port = port;
        }
        async init(){
            if(this.state === State.Connecting || this.state === State.Open){return;};
            try {
                this.state = State.Connecting;
                this.client = await CDP({host:this.host,port:this.port,local:true});
                this.client.on('disconnect',async()=>{
                    this.close();
                });
                const {Network,Page,Runtime,Debugger} = this.client;
                this.debuger = Debugger;
                Debugger.on('scriptParsed',(params)=>{
                    if (!params || !params.url || !params.scriptId){return;}
                    const scriptId = params.scriptId;
                    const filePath = createHash(params.url);
                    this.idMap.set(scriptId,filePath);
                    this.pathMap.set(filePath,scriptId);
                    // console.log('写入文件信息',scriptId,filePath);
                });
                Debugger.on('scriptFailedToParse',(params)=>{});
                await Runtime.enable();
                await Debugger.enable({maxScriptsCacheSize: 10000000});
                this.state = State.Open;
            } catch (error) {
                console.log('出错',error);
                this.close();
            };
        }
        close(){
            if(!this.client){return;};
            this.client.close();
            this.client = null;
            this.debuger = null;
            this.state = State.Close;
        }
        async update(filePath){
            if(!this.debuger){return;}
            const scriptSource = fs.readFileSync(filePath,'utf-8');
            const scriptId = this.pathMap.get(createHash(filePath));
            if(scriptId === undefined){return;};
            const isExist = await this.debuger.getScriptSource({scriptId});
            if(!isExist || isExist.scriptSource === scriptSource){return;};                         // 代码一样则不需要处理
            const res = await this.debuger.setScriptSource({scriptId,scriptSource});                // 重载
            console.log(`HotReLoad -> ${filePath}`);
        }
    };
    const jsEnvs:any = Puerts.JsEnv.jsEnvs;
    const debugers = (()=>{
        let result = new Map();
        for(let i=0,len=jsEnvs.Count; i<len; i++){
            const item = jsEnvs.get_Item(i);
            if(item && item.debugPort !== -1){
                const hotReload = new HotReLoad(item.debugPort);
                result.set(item.debugPort,hotReload);
                hotReload.init();
            };
        };
        return result;
    })();

    // 创建文件重载接收接收服务
    const dgram = require('dgram');
    const server = dgram.createSocket('udp4');
    server.on('message', (msg, rinfo) => {
        debugers.forEach((item)=>{
            try {
                item.update(msg);
            } catch (error) {
                console.log(error);
            };
        });
    });
    server.bind(43899);
})();

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
