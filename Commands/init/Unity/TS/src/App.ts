import ue = CS.UnityEngine;                                                                         // 是用来协助进行类型检查和声明的，在运行时是完全不存在
import Ticker from './Core/Ticker';
const { GameObject, Time, Vector2, Vector3, RenderMode, Camera, Canvas, CanvasRenderer, MeshFilter, Mesh,
    MeshRenderer, Light, LightType, FontStyle, Quaternion, UI, CameraClearFlags, Resources, EventSystems,
    RectTransform, TextAnchor, LightmapBakeType} = CS.UnityEngine;
const {CanvasScaler,Slider} = CS.UnityEngine.UI;
const {$typeof} = puer;

namespace Game {
    interface GameOption {
        /** 每秒最大渲染帧数限制 */
        maxFps?:number,
        /**是否为线上*/
        online?:boolean
    }
    interface GameObj {
        object:ue.GameObject,
        components?:{
            camera?:ue.Camera,
            canvas?:ue.Canvas,
            canvaslScale?:ue.UI.CanvasScaler,
            graphicRaycaster?:ue.UI.GraphicRaycaster
            eventSystem?:ue.EventSystems.EventSystem,
            standaloneInputModule?:ue.EventSystems.StandaloneInputModule,
            text?:ue.UI.Text,
            rectTransform?:ue.RectTransform,
            slider?:ue.UI.Slider
        }
    }
    interface RandomizeMatrix {
        position:[number,number,number],
        scale:[number,number,number],
        rotaion:[number,number,number]
    }
    export class App{
        private _maxFps:number;                                                                     // 最大帧
        private ticker:Ticker;                                                                      // 轮循执行器
        public static mainCamera:ue.GameObject;                                                     // 主相机
        public static uiCamera:ue.GameObject;                                                       // Ui相机
        public static uiCanvas:ue.GameObject;                                                       // Ui画布
        public static eventSystem:ue.GameObject;                                                    // Ui事件系统
        public static stage:ue.GameObject;                                                          // 舞台节点

        private cubeList:ue.GameObject[] = [];                                                      // 保存 Cube 列表
        private cubeCont:number = 100;                                                              // 记录 Cube 数量
        private speed:number = 1;                                                                   // 记录 Cube 速度

        /**
         * 构造方法
         * @param option 游戏启动参数
         */
        constructor(option?:GameOption){
            if(option){
                for(let key in option){
                    this[key] = option[key];
                };
            };
            if(!this.maxFps){
                this.maxFps = 60;
            };
            if(!this.maxFps){
                this.maxFps = 60;
            };
            this.ticker = new Ticker(this.maxFps);                                                  
        }

        /**
         * 应用启动入口
         */
        async init():Promise<void>{
            this.ticker.start();                                                                    // 启动轮循执行器
            
            const mainCameraObj = this.createMainCamera();
            App.mainCamera = mainCameraObj.object;                                                  // 创建主相机
            
            const uiCameraObj = this.createUiCamera();
            App.uiCamera = uiCameraObj.object;                                                      // 创建UI相机
            
            const canvasObj = this.createCanas(uiCameraObj.components.camera);
            App.uiCanvas = canvasObj.object;                                                        // 创建UI画布
            
            const eventSystemObj = this.createEventSystem();
            App.eventSystem = eventSystemObj.object;                                                // 创建UI事件系统
            
            App.stage = new GameObject("Stage");                                                    // 创建舞台，内容全在舞台上

            const speedTextObj = this.createUiText('TextSpeed');                                    // 速度文本
            const countTextObj = this.createUiText('TextCount');                                    // 数量文本
            countTextObj.components.rectTransform.anchoredPosition = new Vector2(0,-40);            // 调整显示位置稍微向下偏移一点

            const timers = {};                                                                      // 用于保存计时器，防抖之用
            const updateSpeed = (val:number)=>{                                                     // 更新速度方法
                this.speed = val;
                speedTextObj.components.text.text = `Speed:${val.toFixed(3)}`
            };
            updateSpeed(this.speed);                                                                // 速度首次初始化

            const updateCount = (val:number)=>{                                                     // 更新数量方法
                val = ~~val;                                                                        // 取整
                if(val === this.cubeList.length){return;};                                          // 值与当前列表的数量一样则无需处理
                this.cubeCont = val;                                                                // 记录最新数量
                countTextObj.components.text.text = `Count:${this.cubeCont}`;                       // 更新提示文字
                clearTimeout(timers['updateCount']);                                                // 防抖处理
                timers['updateCount'] = setTimeout(() => {                                          // 防抖处理
                    this.cubeList = this.createCubeList();
                }, 200);
            };
            updateCount(this.cubeCont);                                                             // 数量首次初始化

            const speedSlideObj = this.createUiSlider('SliderSpeed',updateSpeed);                   // 创建调节速度的Slide
            speedSlideObj.components.slider.minValue = this.speed;                                  // 最小值为默认初始值
            speedSlideObj.components.slider.maxValue = this.speed + 100 - this.speed;               // 最大值100

            const countSlideObj = this.createUiSlider('SliderCount',updateCount);                   // 创建调节数量的Slide
            countSlideObj.components.rectTransform.anchoredPosition = new Vector2(0,80);            // 调整显示位置稍微向下偏移一点
            countSlideObj.components.slider.minValue = this.cubeCont;                               // 最小值为默认初始值
            countSlideObj.components.slider.maxValue = this.cubeCont + 3000 - this.cubeCont;        // 最大值3000
            
            const update = (deltaTime:number)=>{                                                    // 更新方法（当热重载开启时，修改该方法即时生效）
                for(let i=0,len=this.cubeList.length; i<len; i++){
                    const cube = this.cubeList[i];
                    const r = Vector3.op_Multiply(new Vector3(1,1,0), deltaTime / 100 * this.speed);
                    cube.transform.Rotate(r);
                };
            };
            Ticker.add(update);                                                                     // 添加轮循执行方法，这里的 deltaTime 为 ms（实际生产中不建议这么写，update 可以放在对象上也同样能实现热重载）
        }

        /**
         * 创建 Text Ui
         * @param name string 对象名称
         * @returns GameObj
         */
        createUiText(name:string):GameObj{
            const object:ue.GameObject = new GameObject(name);
            object.transform.SetParent(App.uiCanvas.transform,false);
            object.AddComponent($typeof(CanvasRenderer));
            const text:ue.UI.Text = object.AddComponent($typeof(UI.Text)) as ue.UI.Text;
            text.font = Resources.Load("Fonts/Arial") as ue.Font;
            text.alignment = TextAnchor.MiddleCenter;
            text.fontSize = 24;
            text.fontStyle = FontStyle.Bold;
            // text.text = `${speed}`;
            const rectTransform:ue.RectTransform = object.GetComponent($typeof(RectTransform)) as ue.RectTransform;
            rectTransform.localPosition = new Vector3(0,423,0);
            rectTransform.anchorMin = new Vector2(0,1);
            rectTransform.anchorMax = new Vector2(1,1);
            rectTransform.anchoredPosition = new Vector2(0,0);
            rectTransform.sizeDelta = new Vector2(0,120);
            rectTransform.pivot = new Vector2(0.5,1);
            return {object,components:{text,rectTransform}};
        }

        /**
         * 创建 Slider Ui
         * @param name string 对象名称
         * @param call function Ui事件触发方法
         * @returns GameObj
         */
        createUiSlider(name:string,call:ue.Events.UnityAction$1<number>):GameObj{
            const object:ue.GameObject = GameObject.Instantiate(Resources.Load("Prefabs/Slider")) as ue.GameObject;
            object.name = name;
            const rectTransform:ue.RectTransform = object.GetComponent($typeof(RectTransform)) as ue.RectTransform;
            const slider:ue.UI.Slider = object.GetComponent($typeof(Slider)) as ue.UI.Slider;
            slider.minValue = 1;
            slider.maxValue = 10;
            // slider.wholeNumbers = true;
            slider.onValueChanged.AddListener(call);                                                  // 为 UI 添加事件绑定
            rectTransform.transform.localPosition = new Vector3(0,160,0);
            rectTransform.transform.localScale = new Vector3(2,2,2);
            rectTransform.sizeDelta = new Vector2(120,20);
            object.transform.SetParent(App.uiCanvas.transform,false);
            return {object,components:{slider,rectTransform}};
        }

        /**
         * 创建随机矩阵
         * @returns RandomizeMatrix
         */
        createRandomizeMatrix():RandomizeMatrix{
            const position:RandomizeMatrix['position'] = [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
            ];
            const scaleVal = Math.random() * 1;
            const scale:RandomizeMatrix['scale'] = [scaleVal,scaleVal,scaleVal];
            const rotaion:RandomizeMatrix['rotaion'] = [
                Math.random() * 90 * Math.PI,
                Math.random() * 90 * Math.PI,
                Math.random() * 90 * Math.PI
            ];
            return {position,scale,rotaion};
        }

        /**
         * 创建Cube列表
         * @returns ue.GameObject[]
         */
        createCubeList():ue.GameObject[]{
            for(let i=0,len=this.cubeList.length; i<len; i++){                                      // 销毁已有的
                GameObject.Destroy(this.cubeList[i]);
                // CS.UnityEngine.Object.DestroyImmediate(this.cubeList[i]);
            };
            const result:ue.GameObject[] = [];
            for(let i=0; i<this.cubeCont; i++){
                const cube:ue.GameObject = this.createCube(`Cube${i}`);
                result.push(cube);
            };
            return result;
        }

        /**
         * 创建Cube
         * @param name string cube名称
         * @returns ue.GameObject
         */
        createCube(name:string):ue.GameObject{
            const object:ue.GameObject = new GameObject(name);
            object.transform.SetParent(App.stage.transform);
            const cube_mf:ue.MeshFilter = object.AddComponent($typeof(MeshFilter)) as ue.MeshFilter;
            cube_mf.mesh = Resources.GetBuiltinResource($typeof(Mesh),"Cube.fbx") as ue.Mesh;
            const cube_mr:ue.MeshRenderer = object.AddComponent($typeof(MeshRenderer)) as ue.MeshRenderer;
            const cube_t = Resources.Load("Textures/PuertsLogo") as ue.Texture;
            cube_mr.material.SetFloat('_Metallic',0.8);
            cube_mr.material.SetFloat('_Glossiness',0.78);
            cube_mr.material.SetTexture('_MainTex',cube_t);
            const randomizeMatrix = this.createRandomizeMatrix();
            object.transform.localPosition = new Vector3(...randomizeMatrix.position);
            object.transform.localRotation = Quaternion.Euler(...randomizeMatrix.rotaion);
            // object.transform.localScale = new Vector3(...randomizeMatrix.scale);
            object.transform.SetParent(App.stage.transform);
            return object;
        }

        set maxFps(val:number){
            this._maxFps = val;
        }
        get maxFps():number{
            return this._maxFps;
        }

        /**
         * 创建主相机
         * @returns ue.GameObject
         */
        createMainCamera():GameObj{
            const object:ue.GameObject = new GameObject("Main Camera");
            let camera:ue.Camera = object.AddComponent($typeof(Camera)) as ue.Camera;
            camera.clearFlags = CameraClearFlags.Skybox;
            camera.cullingMask = ~(1 << 5);                                                         // 主相机渲染除UI的所有层（https://gameinstitute.qq.com/community/detail/126782）
            camera.nearClipPlane = 2;
            camera.farClipPlane = 40;
            camera.transform.Rotate(20,0,0);
            camera.transform.localScale = new Vector3(0.5,0.5,0.5);
            camera.transform.localPosition = new Vector3(0,7,-20);
            return {object,components:{camera}};
        }

        /**
         * 创建UI相机
         * @returns object
         */
        createUiCamera():GameObj{
            const object:ue.GameObject = new GameObject("Ui Camera");
            object.transform.position = new Vector3(-10,0,0);
            const camera:ue.Camera = object.AddComponent($typeof(Camera)) as ue.Camera;
            camera.clearFlags = CameraClearFlags.Depth;
            camera.cullingMask = 1 << 5;                                                            // UI相机仅渲染UI层
            camera.orthographic = true; 
            camera.nearClipPlane = 5;
            camera.farClipPlane = 15;
            return {object,components:{camera}};
        }

        /**
         * 创建Ui画布
         */
        createCanas(cameraComponent:ue.Camera):GameObj{
            const object:ue.GameObject = new GameObject("Canvas");
            object.layer = 5;                                                                       // 设置属于UI层
            const canvas:ue.Canvas = object.AddComponent($typeof(Canvas)) as ue.Canvas;
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = cameraComponent;
            canvas.planeDistance = 10;
            const canvaslScale:ue.UI.CanvasScaler = object.AddComponent($typeof(CanvasScaler)) as ue.UI.CanvasScaler;
            canvaslScale.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvaslScale.referenceResolution = new Vector2(428,926);
            canvaslScale.matchWidthOrHeight = 1;
            const graphicRaycaster = object.AddComponent($typeof(UI.GraphicRaycaster)) as ue.UI.GraphicRaycaster;
            return {object,components:{canvas,canvaslScale,graphicRaycaster}};
        }

        /**
         * 创建UI事件系统
         * @returns object
         */
        createEventSystem():GameObj{
            const object:ue.GameObject = new GameObject("EventSystem");
            const eventSystem = object.AddComponent($typeof(EventSystems.EventSystem)) as ue.EventSystems.EventSystem;
            const standaloneInputModule = object.AddComponent($typeof(EventSystems.StandaloneInputModule)) as ue.EventSystems.StandaloneInputModule;
            return {object,components:{eventSystem,standaloneInputModule}};
        }
    }
}
(()=>{
    const app = new Game.App({maxFps:60,online:false});
    app.init();
})()
export default Game.App;