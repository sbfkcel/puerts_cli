const config = {
    des:{                                                                                           // 任务描述
        cn:'在当前目录初始化一个 puerts 工程项目',
        en:'Initialize a puerts project in the current directory'
    },
    params:{
        '-f,--force':{
            des:{
                cn:'强制执行，默认：false，（该操作将会覆盖已有文件）',
                en:'Mandatory, default: false, (this operation will overwrite existing files)'
            },
            default:false,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'boolean'){
                    return {
                        cn:'--force 传入的值必须为 true、flase',
                        en:'The value passed in by --force must be true or false'
                    }
                };
            },
            format: val => {                                                                        // 格式化参数
                if(/^true|1$/i.test(val)){
                    return true;
                };
                if(/^false|0$/i.test(val)){
                    return false;
                };
            }
        },
        '-h,--help':{
            des:{
                cn:'查看 init 帮助',
                en:'View init help'
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