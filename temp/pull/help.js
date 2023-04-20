const defaultVersion = '2';
const config = {
  des: {                                                                                            // 任务描述
    cn: '拉取 Puerts',
    en: 'Pull Puerts'
  },
  params: {
    '-t,--tag': {
      des: {
        cn: `要拉取的 Puerts 版本号，例如：2.0、2.0.x`,
        en: `The Puerts version number to pull, eg: 2.0, 2.0.x`
      },
      default: defaultVersion,
      check: val => {                                                                               // 检查参数，如果检查到错误要返回一个对象（包含：cn、en）
        const re = /^((\d+\.\d)|(\d+\.\d+\.\d))$/;
        if (!re.test(val)) {
          return {
            cn: `Tag 传入的值必须为 x.x、x.x.x 格式，默认：${defaultVersion}`,
            en: `Tag the transmitted value must be in x.x, x.x.x format，Default：${defaultVersion}`
          }
        };
      },
      format: val => {
        return val + '';
      }
    },
    '-r,--runtime': {
      des: {
        cn: '运行时，可选：v8、quickjs，默认：v8',
        en: 'Runtime, optional: v8, quickjs, default: v8'
      },
      default: 'v8',
      check: val => {
        if (!(/^(v8|quickjs)$/.test(val))) {
          return {
            cn: `Runtime 值必须为 v8、quickjs，默认：v8`,
            en: `Runtime value must be v8, quickjs, default: v8`
          }
        }
      },
      format: val => {
        return val.toLocaleLowerCase();
      }
    },
    '-h,--help': {
      des: {
        cn: '查看 pull 帮助',
        en: 'View pull help'
      },
      check: val => {
        return {
          cn: '查看帮助不需要参数',
          en: 'View help does not require parameters'
        }
      }
    }
  }
};
export default config;
