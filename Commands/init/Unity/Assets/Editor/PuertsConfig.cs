/// <summary>
/// 官方说明 https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md
/// </summary>
using System.Collections.Generic;
using Puerts;
using System;
using UnityEngine;

/// <summary>
/// 配置类
/// ! 配置类必须打 [Configure] 标签
/// ! 必须放在Editor目录
/// </summary>
[Configure]
public class PuertsConfig {

    /// <summary>
    /// 在 Js/Ts 调用时可以找到该类
    /// * 会生成一个静态类（wrap），在 Js 调用时将直接静态调用加快速度，否则通过反射调用
    /// * 会生成到 Assets/Gen/Typing/csharp/index.d.ts ，以在 Ts 中引用
    /// ! 须放在 [Configure] 标记过的类里
    /// </summary>
    /// <value></value>
    [Binding]
    static IEnumerable<Type> Bindings {
        get {
            var types = new List<Type>();
            var namespaces = new HashSet<string>();
            namespaces.Add("Game");
            namespaces.Add("tiny");
            namespaces.Add("tiny.utils");
            Dictionary<string, HashSet<string>> ignored = new Dictionary<string, HashSet<string>>();
            var ignored_classes = new HashSet<string>();

            // 忽略 tiny.EditorUtils 类
            ignored_classes = new HashSet<string>();
            ignored_classes.Add("EditorUtils");
            ignored.Add("tiny", ignored_classes);

            // TODO：在此处添加要忽略绑定的类型
            Dictionary<string, HashSet<string>> registered = new Dictionary<string, HashSet<string>>();
            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies()) {
                var name = assembly.GetName().Name;
                foreach (var type in assembly.GetTypes()) {
                    if (!type.IsPublic) continue;
                    if (type.Name.Contains("<") || type.Name.Contains("*")) continue;               // 忽略泛型，指针类型
                    if (type.Namespace == null || type.Name == null) continue;                      // 这是啥玩意？
                    bool accept = namespaces.Contains(type.Namespace);
                    if (accept && ignored.ContainsKey(type.Namespace) && ignored[type.Namespace].Contains(type.Name)) continue;
                    if (accept) {
                        types.Add(type);
                        if (!registered.ContainsKey(type.Namespace)) {
                            var classes = new HashSet<string>();
                            classes.Add(type.Name);
                            registered.Add(type.Namespace, classes);
                        } else {
                            registered[type.Namespace].Add((type.Name));
                        }
                    }
                }
            }

            // 绑定 Unity常用类型
            types.Add(typeof(UnityEngine.Light));
            types.Add(typeof(UnityEngine.Debug));
            types.Add(typeof(UnityEngine.Vector2));
            types.Add(typeof(UnityEngine.Vector3));
            types.Add(typeof(UnityEngine.Vector4));
            types.Add(typeof(UnityEngine.Quaternion));
            types.Add(typeof(UnityEngine.RenderMode));
            types.Add(typeof(UnityEngine.Canvas));
            types.Add(typeof(UnityEngine.CanvasRenderer));
            types.Add(typeof(UnityEngine.UI.Text));
            types.Add(typeof(UnityEngine.UI.CanvasScaler));
            types.Add(typeof(UnityEngine.UI.GraphicRaycaster));

            types.Add(typeof(UnityEngine.UI.Slider));
            types.Add(typeof(UnityEngine.UI.Slider.SliderEvent));
            types.Add(typeof(UnityEngine.Events.UnityEvent<bool>));
            types.Add(typeof(UnityEngine.EventSystems.EventSystem));
            types.Add(typeof(UnityEngine.EventSystems.StandaloneInputModule));
            
            types.Add(typeof(UnityEngine.MeshFilter));
            types.Add(typeof(UnityEngine.Mesh));
            types.Add(typeof(UnityEngine.Shader));
            types.Add(typeof(UnityEngine.Renderer));
            types.Add(typeof(UnityEngine.MeshRenderer));
            types.Add(typeof(UnityEngine.Texture));
            types.Add(typeof(UnityEngine.CameraClearFlags));
            types.Add(typeof(UnityEngine.PrimitiveType));
            types.Add(typeof(UnityEngine.Material));
            types.Add(typeof(UnityEngine.ParticleSystemRenderer));
            types.Add(typeof(UnityEngine.Resources));
            types.Add(typeof(UnityEngine.Color));
            types.Add(typeof(UnityEngine.Rect));
            types.Add(typeof(UnityEngine.Bounds));
            types.Add(typeof(UnityEngine.Ray));
            types.Add(typeof(UnityEngine.RaycastHit));
            types.Add(typeof(UnityEngine.Matrix4x4));

            types.Add(typeof(UnityEngine.Time));
            types.Add(typeof(UnityEngine.Transform));
            types.Add(typeof(UnityEngine.RectTransform));
            types.Add(typeof(UnityEngine.Object));
            types.Add(typeof(UnityEngine.GameObject));
            types.Add(typeof(UnityEngine.Component));
            types.Add(typeof(UnityEngine.Behaviour));
            types.Add(typeof(UnityEngine.MonoBehaviour));
            types.Add(typeof(UnityEngine.AudioClip));
            types.Add(typeof(UnityEngine.ParticleSystem.MainModule));
            types.Add(typeof(UnityEngine.AnimationClip));
            types.Add(typeof(UnityEngine.Animator));
            types.Add(typeof(UnityEngine.AnimationCurve));
            types.Add(typeof(UnityEngine.AndroidJNI));
            types.Add(typeof(UnityEngine.AndroidJNIHelper));
            types.Add(typeof(UnityEngine.Collider));
            types.Add(typeof(UnityEngine.Collision));
            types.Add(typeof(UnityEngine.Rigidbody));
            types.Add(typeof(UnityEngine.Screen));
            types.Add(typeof(UnityEngine.Texture));
            types.Add(typeof(UnityEngine.TextAsset));
            types.Add(typeof(UnityEngine.SystemInfo));
            types.Add(typeof(UnityEngine.Input));
            types.Add(typeof(UnityEngine.Mathf));

            types.Add(typeof(UnityEngine.Camera));
            types.Add(typeof(UnityEngine.Camera.RenderRequest));
            types.Add(typeof(UnityEngine.ParticleSystem));
            // types.Add(typeof(UnityEngine.AudioSource));
            types.Add(typeof(UnityEngine.AudioListener));
            types.Add(typeof(UnityEngine.Physics));
            types.Add(typeof(UnityEngine.SceneManagement.Scene));
            types.Add(typeof(UnityEngine.Networking.IMultipartFormSection));
            types.Add(typeof(UnityEngine.Networking.UnityWebRequest));
            return types;
        }
    }
    /// <summary>
    /// 对定义的 Blittable 值类型通过内存拷贝传递，可避免值类型传递产生的GC，需要开启unsafe编译选项
    /// ! 只能用在属性上
    /// ! 需要开启 unsafe 编译选项 
    /// ! 须放在 [Configure] 标记过的类里
    /// </summary>
    /// <value></value>
    [BlittableCopy]
    static IEnumerable<Type> Blittables {
        get {
            return new List<Type>() {
                typeof(Vector2),
                typeof(Vector3),
                typeof(Vector4),
                typeof(Quaternion),
                typeof(Color),
                typeof(Rect),
                typeof(Bounds),
                typeof(Ray),
                typeof(RaycastHit),
                typeof(Matrix4x4)
            };
        }
    }
    
    /// <summary>
    /// 过滤函数
    /// ! 只能用在函数上
    /// ! 须放在 [Configure] 标记过的类里
    /// </summary>
    /// <param name="memberInfo"></param>
    /// <returns></returns>
    [Filter]
    static bool FilterMethods(System.Reflection.MemberInfo memberInfo){
        string sig = memberInfo.ToString();

        if (memberInfo.ReflectedType.FullName == "UnityEngine.MonoBehaviour" && memberInfo.Name == "runInEditMode") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Input" && memberInfo.Name == "IsJoystickPreconfigured") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Texture" && memberInfo.Name == "imageContentsHash") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.MeshRenderer" && memberInfo.Name == "stitchLightmapSeams") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.MeshRenderer" && memberInfo.Name == "receiveGI") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.MeshRenderer" && memberInfo.Name == "scaleInLightmap") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.ParticleSystemRenderer" && memberInfo.Name == "supportsMeshInstancing") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.UI.Text" && memberInfo.Name == "OnRebuildRequested") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Light" && memberInfo.Name == "SetLightDirty") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Light" && memberInfo.Name == "shadowRadius") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Light" && memberInfo.Name == "shadowAngle") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Light" && memberInfo.Name == "areaSize") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.Light" && memberInfo.Name == "lightmapBakeType") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.CanvasRenderer" && memberInfo.Name == "OnRequestRebuild") return true;
        if (memberInfo.ReflectedType.FullName == "UnityEngine.CanvasRenderer" && memberInfo.Name == "onRequestRebuild") return true;
        // if (memberInfo.Name == "OnRequestRebuild") return true;
        // TODO: 添加要忽略导出的类成员

        return sig.Contains("*");
    }
}