const platformArr = ["win", "osx", "linux", "android", "ios"];                                      // 支持的目标平台
const archArr = ["auto","x64","ia32","armv7","arm64"];                                              // 支持的架构
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
                cn:`平台须为 ${platformArr.join("、")}，默认：${defaultPlatform}`,
                en:`Platform must be ${platformArr.join("、")}, default: ${defaultPlatform}`
            },
            default: defaultPlatform,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(platformArr.indexOf(val) < 0){
                    return {
                        cn:`Platform 值必须为 ${platformArr.join("、")}，默认：${defaultPlatform}`,
                        en:`Platform value must be ${platformArr.join("、")}`
                    }
                }
            },
            format: val => {
                return (val+'').toLocaleLowerCase();
            }
        },
        '-a,--arch':{
            des:{
                cn:`目标架构，传入的值必须为 ${archArr.join("、")}，默认：${archArr[0]}`,
                en:`The target architecture`
            },
            default:archArr[0],
            check: val => {
                if(archArr.indexOf(val) < 0){
                    return {
                        cn:`Arch 值必须为 ${archArr.join("、")}，默认：${archArr[0]}`,
                        en:`Arch value must be ${archArr.join("、")}，default：${archArr[0]}`
                    }
                }
            },
            format: val => {
                return (val+'').toLocaleLowerCase();
            },
        },
        '-r,--runtime':{
            des:{
                cn:'运行时，可选：v8、quickjs，默认：v8',
                en:'Runtime, optional: v8, quickjs, default: v8'
            },
            default:'v8',
            check: val => {
                if(!(/^(v8|quickjs)$/.test(val))){
                    return {
                        cn:`Runtime 值必须为 v8、quickjs，默认：v8`,
                        en:`Runtime value must be v8, quickjs, default: v8`
                    }
                }
            },
            format: val => {
                return val.toLocaleLowerCase();
            }
        },
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