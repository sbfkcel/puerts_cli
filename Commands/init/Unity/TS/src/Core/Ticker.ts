import { requestAnimationFrame,cancelAnimationFrame } from './requestAnimationFrame';

namespace Game {
    /**
     * 轮循环执行器
     */
    export class Ticker {
        private time:NodeJS.Timeout;
        private _maxFps:number;
        private maxIntervalTime:number;
        private isPlay = true;
        private static tempTasks:Function[];
        public static tasks:Function[] = [];
        constructor(maxFps:number){
            this.maxFps = maxFps;
        }
        get maxFps(){
            return this._maxFps;
        }
        set maxFps(val:number){
            this._maxFps = val;
            this.maxIntervalTime = 1000 / val;
        }
        start(){
            this.isPlay = true;
            this.time = requestAnimationFrame(this.loop.bind(this),this.maxIntervalTime);
        }
        stop(){
            this.isPlay = false;
            cancelAnimationFrame(this.time);
        }
        loop(deltaTime:number){
            if(!this.isPlay){
                return;
            };
            for(let i=0,len=Ticker.tasks.length; i<len; i++){
                const run:Function = Ticker.tasks[i];
                run(deltaTime);
            };
            if(Ticker.tempTasks){                                                                   // 本轮执行完成，如果有新任，则将临时队列替换为要正式执行的任务
                Ticker.tasks = Ticker.tempTasks;
                Ticker.tempTasks = null;
            };
            this.time = requestAnimationFrame(this.loop.bind(this),this.maxIntervalTime);
        }
        public static add(fn:Function){
            if(Ticker.tasks.indexOf(fn) < 0){
                Ticker.tasks.push(fn);
            };
        }
        public static remove(fn:Function){
            const index = Ticker.tasks.indexOf(fn);
            if(index > -1){                                                                         // 将新的执行任务临时存放起来，防止当前任务未结束前修改任务列表导致的其它问题
                Ticker.tempTasks = [
                    ...Ticker.tasks.slice(0,index),
                    ...Ticker.tasks.slice(index+1)
                ];
            };
        }
    }
}

export default Game.Ticker;