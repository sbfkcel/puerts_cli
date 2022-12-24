const config = {
    des:{                                                                                           // 任务描述
        cn:'启动开发模式，监听 TS 修改并自动编译',
        en:'Start the development mode, monitor TS modification and compile automatically'
    },
    params:{
        '-r,--reload':{
            des:{
                cn:'热重载端服务端口号（即虚拟机调试端口号），多个可分开传入，默认：43990',
                en:'The service port number of the hot reload side (that is, the virtual machine debugging port number), multiple can be passed in separately, default: 43990'
            },
            default: 43990,
            check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
                if(typeof val !== 'number' || isNaN(val) || val < 1 || val > 65535){
                    return {
                        cn:'--reload 传入的值必须为一个可用的有效端口号，默认：43990',
                        en:'--reload The value passed in must be a valid port number that is available, default:43990'
                    }
                };
            },
            format: val => {
                return +val;
            }
        },
        '-h,--help':{
            des:{
                cn:'查看 dev 帮助',
                en:'View dev help'
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