let lastTime = +new Date;
/**
 * 类似浏览器中的 requestAnimationFrame
 * @param callback 
 * @param fps 
 * @returns 
 */
export const requestAnimationFrame = (callback:Function,fps:number):NodeJS.Timeout=>{
    const currentTime:number = +new Date();
    const timeToCall:number = Math.max(0,fps-(currentTime - lastTime));
    const id:NodeJS.Timeout = setTimeout(()=>{
        callback(timeToCall);
    },timeToCall);
    lastTime = currentTime + timeToCall;
    return id;
};

/**
 * 类似浏览器中的 cancelAnimationFrame
 * @param id 
 */
export const cancelAnimationFrame = (id:NodeJS.Timeout):void=>{
    clearTimeout(id);
};