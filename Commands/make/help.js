const platformArr = ["win", "osx", "linux", "android", "ios"];                                      // 支持的目标平台
const defaultPlatform = (()=>{
    switch (process.platform) {
        case 'win32':
            return platformArr[0];
        break;
        case 'darwin':
            return platformArr[1];
        break;
        case 'linux':
            return platformArr[2];
        break;
        default:
        break;
    };
})()

const config = {
    des:{                                                                                           // 任务描述
        cn:'编译 Puerts 2.x+',
        en:'Compile Puerts 2.x+'
    },
    params:{
        '-p,--platform':{
            des:{
                cn:`目标平台，传入的值必须为 ${platformArr.join("、")}，默认：${defaultPlatform}`,
                en:`Target platform, the value must be ${platformArr.join("、")}, default: ${defaultPlatform}`
            },
            default: defaultPlatform,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(platformArr.indexOf(val) < 0){
                    return {
                        cn:`--platform 传入的值必须为 ${platformArr.join("、")}，默认：${defaultPlatform}`,
                        en:`The value passed in by --platform must be ${platformArr.join("、")}`
                    }
                }
            },
            format: val => {
                return (val+'').toLocaleLowerCase();
            }
        },
        '-a,--arch':{
            des:{
                cn:`目标架构`,
                en:`The target architecture`
            },
            
            default:'auto',
            check: val => {
    
            },
            format: val => {
    
            },
        },
        // '-r,--runtime':{
        //     des:{
        //         cn:'JS运行时，可选：v8、quickjs，默认：v8',
        //         en:'JS runtime, optional: v8, quickjs, default: v8'
        //     }
        // },
        // '-t,--target':{

        // },
        '-h,--help':{
            des:{
                cn:'查看 make 帮助',
                en:'View make help'
            },
            check: val => {
                return {
                    cn:'查看帮助不需要参数',
                    en:'View help does not require parameters'
                }
            }
        }
    }
};
export default config;