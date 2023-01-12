interface AnimationFrame {
    requestAnimationFrame?:Function,
    cancelAnimationFrame?:Function,
    setTimeout?:Function,
    clearTimeout?:Function,
    performance?:any
};

const obj:AnimationFrame = globalThis || window || {};
const _requestAnimationFrame = obj.requestAnimationFrame || obj.setTimeout;
const _cancelAnimationFrame =  obj.cancelAnimationFrame || obj.clearTimeout;
const startTime = +new Date;

let lastTime:number;
const customRequestAnimationFrame = (callback:Function,intervalTime:number):number=>{
    const fun = ()=>{
        const currentTime:number = (()=>{                                                           // 当前时间（这里为了V8和Node运行时的兼容，performance 精度更高）
            if(obj.performance){
                return obj.performance.now();
            };
            return +new Date - startTime;
        })();
        lastTime = lastTime || currentTime;                                                         // 防止首次执行无历史时间
        const timeCouse:number = currentTime - lastTime;                                            // 距离上一帧时间
        const isNext:boolean = intervalTime-timeCouse <= 0 || timeCouse === 0;                      // 判断是否执行下一帧
        if(isNext){
            lastTime = currentTime;
            callback(timeCouse,currentTime);
        }else{
            callback();
        };
    };
    return _requestAnimationFrame(fun);
};
const customCancelAnimationFrame = timer => {
    _cancelAnimationFrame(timer);
};
export const requestAnimationFrame = customRequestAnimationFrame;
export const cancelAnimationFrame = customCancelAnimationFrame;