let lastTime;
/**
 * 类似浏览器中的 requestAnimationFrame
 * @param callback function 执行方法
 * @param intervalTime number 间隔时间
 * @returns 
 */
export const requestAnimationFrame = (callback:Function,intervalTime:number):NodeJS.Timeout=>{
    lastTime = lastTime || +new Date;
    const currentTime:number = +new Date;
    const timeCouse:number = currentTime - lastTime;
    const timeToCall = (()=>{
        let result:number = intervalTime-timeCouse;
        result = result < 0 ? intervalTime - result : intervalTime;
        return result;
    })();
    const time:NodeJS.Timeout = setTimeout(()=>{
        callback(timeToCall);
    },timeToCall);
    lastTime = currentTime + timeToCall;
    return time;
};

/**
 * 类似浏览器中的 cancelAnimationFrame
 * @param time 
 */
export const cancelAnimationFrame = (time:NodeJS.Timeout):void=>{
    clearTimeout(time);
};