import axios from 'axios';

/**
 * 最新版本 https://api.github.com/repos/Tencent/puerts/releases/latest
 * 所有版本 https://api.github.com/repos/Tencent/puerts/releases
 */
export const githubInfo = async () => {
    const result = {};
    const list = (await axios('https://api.github.com/repos/Tencent/puerts/releases')).data;
    for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];
        const itemNameStr = item.name.toLocaleLowerCase();
        const itemName = (() => {
            const result = itemNameStr.match(/unity|unreal/);
            return result !== null ? result[0] : undefined;
        })();
        const itemVer = (() => {
            const result = itemNameStr.match(/(\d+\.)+\d+/);
            return result !== null ? result[0] : undefined;
        })();

        if (itemName === 'unity' || itemName === 'unreal') {
            result[itemName] = result[itemName] || {};
            result[itemName][itemVer] = (() => {
                const result = {};
                item.assets.forEach(item => {
                    const runtime = (() => {
                        const result = item.name.match(/nodejs|quickjs|v8/i);
                        return result !== null ? result[0].toLocaleLowerCase() : "v8";
                    })();
                    if (runtime) {
                        result[runtime] = item.browser_download_url;
                    };
                });
                return result;
            })();
        };
    };
    return result;
};


/**
 * https://package.openupm.cn/包名
 * https://package.openupm.cn/-/v1/search?text=关键字
 */
export const upmInfo = async () => {
    const result = { unity: {}, unreal: {} };
    const versions = (await axios('http://package.openupm.cn/com.tencent.puerts.core'))?.data?.versions;
    if (versions) {
        for (const key in versions) {
            const item = versions[key];
            const itemVer = (() => {
                const result = key.match(/(\d+\.)+\d+/);
                return result !== null ? result[0] : undefined;
            })();
            result.unity[itemVer] = {
                v8: item?.dist.tarball
            };
        };
    };
    return result;
};
