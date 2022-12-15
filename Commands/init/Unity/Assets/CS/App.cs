using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Puerts;
namespace Game {
    public class App : MonoBehaviour{
        public string entry = "App.js";                                                             // 入口文件
        public string sourceMap = "SourceMap.js";                                                   // SourceMap 处理文件
        public int debugPort = 43990;                                                               // 调试端口号
        public bool debug = false;                                                                  // 是否开启调试

        private JSLoader jsLoader;                                                                  // JS加载器
        private string jsDir;                                                                       // JS脚本目录
        public static JsEnv vm;

        void Awake(){
            Application.runInBackground = true;
            if(jsDir == null){
                jsDir = Path.Combine(Application.dataPath,"Resources","JS");
            };
            if(jsLoader == null){
                jsLoader = new JSLoader(jsDir);
            };
            if (vm == null){
                #if UNITY_WEBGL && !UNITY_EDITOR
                    vm = Puerts.WebGL.GetBrowserEnv();
                #else
                    vm = new JsEnv(jsLoader, -1, System.IntPtr.Zero, System.IntPtr.Zero);
                    if(sourceMap != string.Empty){                                                  // 启用 SourceMap 映射
                        vm.ExecuteModule(sourceMap);
                    };
                #endif
                vm.UsingAction<bool>();                                                             // 处理事件要用到（有多少类型添加多少个）
                vm.UsingAction<float>();                                                            // 处理事件要用到（有多少类型添加多少个）
            };
            if(debug){                                                                              // 启用调试
                vm.WaitDebugger();
            };
            if(entry != null){
                vm.ExecuteModule(entry);
            };
        }
        void Start(){
            
        }
        void Update(){
            if(vm != null){
                vm.Tick();
            };
        }
        void OnDestroy(){
            if(vm != null){
                vm.Dispose();
            };
        }
    }
}