const config = {
    des:{                                                                                           // 任务描述
        cn:'编译当前项目 TS 为 JS ',
        en:'Compile current project TS to JS'
    },
    params:{
        '-t,--target':{
            des:{
                cn:`目标平台，可选值：pc、minigame，默认为：pc`,
                en:`Target platform, optional values: pc, minigame, default: pc`
            },
            default: 'pc',
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(!/^(pc|minigame)$/i.test(val)){
                    return {
                        cn:'目标平台只能是：pc、minigame',
                        en:'The target platform can only be: pc, minigame'
                    }
                };
            },
            format: val => {                                                                        // 格式化参数
                return val.toLocaleLowerCase();
            }
        },
        '-c,--clear':{
            des:{
                cn:`编译之前是否清理目录，默认：false`,
                en:`Whether to clean up the directory before compiling, default: false`
            },
            default: false,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'boolean'){
                    return {
                        cn:'--clear 传入的值必须为 true、flase',
                        en:'The value passed in by --clear must be true or false'
                    }
                };
            },
            format: val => {
                if(/^true|1$/i.test(val)){
                    return true;
                };
                if(/^false|0$/i.test(val)){
                    return false;
                };
            }
        },
        '-s,--sourcemap':{
            des:{
                cn:`是否启用 Sourcemap，默认：true`,
                en:`Whether to enable Sourcemap, default: true`
            },
            default: true,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'boolean'){
                    return {
                        cn:'--sourcemap 传入的值必须为 true、flase',
                        en:'The value passed in by --sourcemap must be true or false'
                    }
                };
            },
            format: val => {
                if(/^true|1$/i.test(val)){
                    return true;
                };
                if(/^false|0$/i.test(val)){
                    return false;
                };
            }
        },
        '-m,--minify':{
            des:{
                cn:`是否启用 Minify，默认：false`,
                en:`Whether to enable Minify, default: false`
            },
            default: false,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'boolean'){
                    return {
                        cn:'--minify 传入的值必须为 true、flase',
                        en:'The value passed in by --minify must be true or false'
                    }
                };
            },
            format: val => {
                if(/^true|1$/i.test(val)){
                    return true;
                };
                if(/^false|0$/i.test(val)){
                    return false;
                };
            }
        },
        '-b,--browse':{
            des:{
                cn:`是否启用 http Server，默认：false`,
                en:`Whether to enable http Server, default: false`
            },
            default: false,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'boolean'){
                    return {
                        cn:'--browse 传入的值必须为 true、flase',
                        en:'The value passed in by --browse must be true or false'
                    }
                };
            },
            format: val => {
                if(/^true|1$/i.test(val)){
                    return true;
                };
                if(/^false|0$/i.test(val)){
                    return false;
                };
            }
        },
        '-p,--port':{
            des:{
                cn:`指定预览服务端口号，默认：10000`,
                en:`Specify the preview service port number, default: 10000`
            },
            default: 10000,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'number' || isNaN(val) || val < 1 || val > 65535){
                    return {
                        cn:'--port 传入的值必须为一个可用的有效端口号，默认：10000',
                        en:'--port The value passed in must be a valid port number that is available, default:10000'
                    }
                };
            },
            format: val => {
                return +val;
            }
        },
        '-h,--help':{
            des:{
                cn:'查看 build 帮助',
                en:'View build help'
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