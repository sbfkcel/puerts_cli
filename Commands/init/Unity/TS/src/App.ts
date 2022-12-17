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
    interface GameObjectA {
        object:ue.GameObject,
        components?:{
            camera?:ue.Camera,
            canvas?:ue.Canvas,
            canvaslScale?:ue.UI.CanvasScaler,
            graphicRaycaster?:ue.UI.GraphicRaycaster
            eventSystem?:ue.EventSystems.EventSystem,
            standaloneInputModule?:ue.EventSystems.StandaloneInputModule
        }
    }
    export class App{
        private _maxFps:number;
        private ticker:Ticker;                                                                      // 轮循执行器
        public static mainCamera:ue.GameObject;
        public static uiCamera:ue.GameObject;
        public static uiCanvas:ue.GameObject;
        public static eventSystem:ue.GameObject;
        public static stage:ue.GameObject;
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
            
            // 创建Cube
            const cube:ue.GameObject = (()=>{
                const object:ue.GameObject = new GameObject("Cube");
                object.transform.SetParent(App.stage.transform);
                const cube_mf:ue.MeshFilter = object.AddComponent($typeof(MeshFilter)) as ue.MeshFilter;
                cube_mf.mesh = Resources.GetBuiltinResource($typeof(Mesh),"Cube.fbx") as ue.Mesh;
                const cube_mr:ue.MeshRenderer = object.AddComponent($typeof(MeshRenderer)) as ue.MeshRenderer;
                const cube_t = Resources.Load("Textures/PuertsLogo") as ue.Texture;
                cube_mr.material.SetFloat('_Metallic',0.8);
                cube_mr.material.SetFloat('_Glossiness',0.78);
                cube_mr.material.SetTexture('_MainTex',cube_t);
                return object;
            })();
            
            // 创建显示当前速度的组件，并返回文本组件
            let speed = 0;
            const textComponent = (()=>{
                const object:ue.GameObject = new GameObject("Speed");
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
                return text;
            })();

            // 创建设置速度方法
            const setSpeed = (val:number) => {
                speed = val;
                textComponent.text = `Speed:${val}`;
            };
            setSpeed(1);

            // 创建一展灯照在cube脸上
            (()=>{
                const object:ue.GameObject = new GameObject("Light");
                object.transform.SetParent(App.stage.transform);
                object.transform.position = new Vector3(0,2.51,-2.45);
                object.transform.rotation = Quaternion.Euler(45,0,0);
                const light:ue.Light = object.AddComponent($typeof(Light)) as ue.Light;
                light.type = LightType.Spot;
                light.range = 6.4;
                light.spotAngle = 52;
                // light.lightmapBakeType = LightmapBakeType.Baked;                                 // 仅在 Editor 下有效
                light.intensity = 20;
                light.bounceIntensity = 8.5;                                                        // 只有平行光才支持实时反射阴影
            })();

            // 创建一个滑动条改变 cube 旋转速度
            (()=>{
                const object:ue.GameObject = GameObject.Instantiate(Resources.Load("Prefabs/Slider")) as ue.GameObject;
                const rectTransform:ue.RectTransform = object.GetComponent($typeof(RectTransform)) as ue.RectTransform;
                const slider:ue.UI.Slider = object.GetComponent($typeof(Slider)) as ue.UI.Slider;
                slider.minValue = 1;
                slider.maxValue = 10;
                slider.onValueChanged.AddListener(setSpeed);                                        // 为 UI 添加事件绑定
                rectTransform.transform.localPosition = new Vector3(0,160,0);
                rectTransform.transform.localScale = new Vector3(2,2,2);
                rectTransform.sizeDelta = new Vector2(120,20);
                object.transform.SetParent(App.uiCanvas.transform,false);
            })();
            
            // 添加轮循执行方法，这里的 deltaTime 为 ms
            Ticker.add((deltaTime:number)=>{
                const r = Vector3.op_Multiply(new Vector3(1,1,0), deltaTime / 100 * speed * 10);
                cube.transform.Rotate(r);
            });
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
        createMainCamera():GameObjectA{
            const object:ue.GameObject = new GameObject("Main Camera");
            let camera:ue.Camera = object.AddComponent($typeof(Camera)) as ue.Camera;
            camera.clearFlags = CameraClearFlags.Skybox;
            camera.cullingMask = ~(1 << 5);                                                         // 主相机渲染除UI的所有层（https://gameinstitute.qq.com/community/detail/126782）
            camera.nearClipPlane = 2;
            camera.transform.Rotate(20,0,0);
            camera.transform.localScale = new Vector3(0.5,0.5,0.5);
            camera.transform.localPosition = new Vector3(0,1.4,-5);
            return {object,components:{camera}};
        }

        /**
         * 创建UI相机
         * @returns object
         */
        createUiCamera():GameObjectA{
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
        createCanas(cameraComponent:ue.Camera):GameObjectA{
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
        createEventSystem():GameObjectA{
            const object:ue.GameObject = new GameObject("EventSystem");
            const eventSystem = object.AddComponent($typeof(EventSystems.EventSystem)) as ue.EventSystems.EventSystem;
            const standaloneInputModule = object.AddComponent($typeof(EventSystems.StandaloneInputModule)) as ue.EventSystems.StandaloneInputModule;
            return {object,components:{eventSystem,standaloneInputModule}};
        }
    }
}
(()=>{
    const app = new Game.App({maxFps:30,online:false});
    app.init();
})()
export default Game.App;