
import getPathInfo from "../../lib/getPathInfo.js";
import startSymbol from "./startSymbol.js";
const ignore = (item, itemPath) => {
    if (item === 'node_modules' || item === 'Editor') {                                             // 所有 node_modules、Editor 可以过滤掉
        return true;
    };
    if (item.slice(0, 1) === '.') {                                                                 // 所有以 . 开始的文件过滤掉
        return true;
    };
    const { type, extname } = getPathInfo(itemPath);
    if (type === 'file' && !/^(mjs|cjs|js)$/i.test(extname)) {                                      // 是文件类型，但不是 js 文件的过滤掉
        return true;
    };
    if (type === 'file' && itemPath.indexOf(startSymbol) < 0) {                                     // 不在 Resources 的目录也过滤掉
        return true;
    };
}

export default ignore;