import CDP from 'chrome-remote-interface';
import fs from 'node:fs';
import crypto from 'node:crypto';
import createLang from './createLang.js';
import line from './getLine.js';
const createHash = str => crypto.createHash('md5').update(str).digest('hex');
const lang = createLang({
    overload:{
        cn:'重载模块：',
        en:'Overload module:'
    },
    error:{
        cn:'热重载服务启动失败，请确保游戏已启动。',
        en:'The hot reload service failed to start, please make sure the game is started.'
    }
})
const State = {
    None:0,
    Connecting:1,
    Open:2,
    Close:3
};
class HotReLoad {
    constructor(port){
        this.client;
        this.host = '127.0.0.1';
        this.port = port;
        this.debuger;
        this.state;
        this.pathMap = new Map();
        this.idMap = new Map();
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
                const filePath = params.url.replace(/\\/g,'/');
                const filePathHash = createHash(filePath);
                this.idMap.set(scriptId,filePathHash);
                this.pathMap.set(filePathHash,scriptId);
                // console.log('写入文件信息',scriptId,filePathHash);
            });
            Debugger.on('scriptFailedToParse',(params)=>{});
            await Runtime.enable();
            await Debugger.enable({maxScriptsCacheSize: 10000000});
            this.state = State.Open;
        } catch (error) {
            // console.log(lang('error'));
            // console.log(line);
            this.close();
        };
    }
    close(){
        if(this.client){
            this.client.close();
        };
        this.client = null;
        this.debuger = null;
        this.state = State.Close;
    }
    async update(filePath){
        filePath = filePath.replace(/\\/g,'/');
        if(!this.debuger){return;}
        const scriptSource = fs.readFileSync(filePath,'utf-8');
        const scriptId = this.pathMap.get(createHash(filePath));
        if(scriptId === undefined){return;};
        const isExist = await this.debuger.getScriptSource({scriptId});
        if(!isExist || isExist.scriptSource === scriptSource){return;};                             // 代码一样则不需要处理
        const res = await this.debuger.setScriptSource({scriptId,scriptSource});                    // 重载
        console.log(`${lang('overload')}${filePath}`);
    }
};

const createDebugs = async ports => {
    let result = new Map();
    for(let i=0,len=ports.length; i<len; i++){
        const port = ports[i];
        const hotReload = new HotReLoad(port);
        result.set(port,hotReload);
        await hotReload.init();
    };
    return result;
};

export default createDebugs;