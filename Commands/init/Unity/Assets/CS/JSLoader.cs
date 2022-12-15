using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Puerts;

namespace Game {
    public class JSLoader : ILoader, IModuleChecker {
        private string root;

        /// <summary>
        /// 构造方法
        /// </summary>
        /// <param name="root">Js 脚本存放目录</param>
        public JSLoader(string root){
            this.root = root;
        }

        /// <summary>
        /// * 接口要求实现
        /// 判断文件是否存在
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns>true/false</returns>
        public bool FileExists(string filePath){
            // Puerts 需要调用到其目录下的一些 js 文件，这里通通判为存在
            if (IsPuertsModule(filePath)) return true;

            #if UNITY_EDITOR
                return File.Exists(PathUnified(root, filePath));
            #else
                return true;
            #endif
        }

        /// <summary>
        /// 定义哪些文件是 Esmodules
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns>true/false</returns>
        public bool IsESM(string filepath){
            return filepath.Length < 4 || !filepath.EndsWith(".mjs") || !filepath.EndsWith(".js");
        }

        /// <summary>
        /// * 接口要求实现
        /// 文件内容读取
        /// </summary>
        /// <param name="filePath">模块路径</param>
        /// <param name="debugPath">文件完整路径</param>
        /// <returns>文本内容</returns>
        public string ReadFile(string filePath,out string debugPath){
            bool isPuerts = IsPuertsModule(filePath);
            debugPath = isPuerts ? GetPuertsModulePath(filePath) : PathUnified(root, filePath);
            return File.ReadAllText(debugPath);
        }

        /// <summary>
        /// 获取 Puerts 自带模块路径
        /// </summary>
        /// <param name="filePath">Puerts 自带模块名称</param>
        /// <returns>模块完整路径</returns>
        private string GetPuertsModulePath(string filePath) {
            return PathUnified(Application.dataPath,"Puerts/Runtime/Resources",filePath);
        }

        /// <summary>
        /// 判断模块是否为 Puerts自带模块
        /// </summary>
        /// <param name="filePath">模块名称</param>
        /// <returns>true/false</returns>
        private bool IsPuertsModule(string filePath){
            return filePath.StartsWith("puerts/");
        }

        /// <summary>
        /// 纠正路径（Windows下路径斜杠不正确的问题）
        /// </summary>
        /// <param name="args"></param>
        /// <returns>纠正之后的路径</returns>
        private string PathUnified(params string[] args){
            return Path.Combine(args).Replace("\\","/");
        }
    }
}
