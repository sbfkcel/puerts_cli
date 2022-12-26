using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Puerts;

namespace Game {
    public class App : MonoBehaviour{
        [Tooltip("游戏启动入口")]
        public string entry = "App.js";                                                             // 入口文件

        [Tooltip("启用 SourceMap、HotReloa 支持")]
        public string developerTools = "DeveloperTools.js";                                         // SourceMap 处理文件

        [Tooltip("断点调试端口，需要开启 debug 选项")]
        public int debugPort = 43990;                                                               // 调试端口号
        
        [Tooltip("开启调试模式后，每次游戏启动时会阻塞等待调试连接才会向下运行")]
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
                    vm = new JsEnv(jsLoader, debugPort, System.IntPtr.Zero, System.IntPtr.Zero);
                    if(developerTools != string.Empty){                                             // 启用 SourceMap 映射
                        vm.ExecuteModule(developerTools);
                    };
                #endif
                vm.UsingAction<bool>();                                                             // 处理事件要用到（有多少类型添加多少个）
                vm.UsingAction<float>();                                                            // 处理事件要用到（有多少类型添加多少个）
                vm.UsingAction<float,float>();                                                      // 处理事件要用到（有多少类型添加多少个）
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