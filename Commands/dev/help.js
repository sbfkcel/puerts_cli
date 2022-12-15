const config = {
    des:{                                                                                           // 任务描述
        cn:'启动开发模式，监听 TS 修改并自动编译',
        en:'Start the development mode, monitor TS modification and compile automatically'
    },
    params:{
        // '-r,--reload':{
        //     des:{
        //         cn:'是否开启热重载，默认：true',
        //         en:'Whether to enable hot reloading, default: true'
        //     },
        //     default: true,
        //     check: val => {                                                                         // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
        //         if(typeof val !== 'boolean'){
        //             return {
        //                 cn:'--reload 传入的值必须为 true、flase',
        //                 en:'The value passed in by --reload must be true or false'
        //             }
        //         };
        //     },
        //     format: val => {
        //         if(/^true|1$/i.test(val)){
        //             return true;
        //         };
        //         if(/^false|0$/i.test(val)){
        //             return false;
        //         };
        //     }
        // },
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