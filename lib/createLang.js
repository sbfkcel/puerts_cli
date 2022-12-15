import localLang from "./getLocalLang.js";
const createLang = obj => {
    return key => obj[key][localLang];
}

export default createLang;