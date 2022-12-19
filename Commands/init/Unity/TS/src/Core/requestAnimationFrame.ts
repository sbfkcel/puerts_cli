if (!Date.now)
    Date.now = function() { return new Date().getTime(); };/**
 * 类似浏览器中的 requestAnimationFrame
 * @param callback 
 * @param fps 
 * @returns 
 */
export const requestAnimationFrame = (callback:Function,fps:number):NodeJS.Timeout=>{
    var lastTime = 0;
    var now = Date.now();
            var nextTime = Math.max(lastTime + (1000 / fps), now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
};

/**
 * 类似浏览器中的 cancelAnimationFrame
 * @param time 
 */
export const cancelAnimationFrame = (time:NodeJS.Timeout):void=>{
    clearTimeout(time);
};