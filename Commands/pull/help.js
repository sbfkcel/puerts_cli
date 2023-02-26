const defaultVersion = '2';
const config = {
    des:{                                                                                           // 任务描述
        cn:'拉取 Puerts',
        en:'Pull Puerts'
    },
    params:{
        '-v,--ver':{
            des:{
                cn:`指定要拉取的 Puerts 版本号，例如：2、2.x.x，如果只输入大版本号则拉取该最新版本`,
                en:`Specify the Puerts version number to be pulled, for example: 2, 2.x.x, if only the major version number is entered, the latest version will be pulled`
            },
            default: defaultVersion,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                const re = /^((\d+)|(\d+\.\d+\.\d))$/;
                if(!re.test(val)){
                    return {
                        cn:`--ver 传入的值必须为 x、x.x.x 格式，默认：${defaultVersion}`,
                        en:`--ver The transmitted value must be in X, X.X.X format，Default：${defaultVersion}`
                    }
                };
            },
            format: val => {
                return val+'';
            }
        },
        '-h,--help':{
            des:{
                cn:'查看 pull 帮助',
                en:'View pull help'
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