/**
 * 字符串对齐方法
 * @param {string} str 字符串
 * @param {number} len 对齐长度
 * @param {string} align 对齐方式
 * @returns string
 */
const alignString = (str,len,align='left') => {
    switch (align) {
        case 'left':
            return str.padEnd(len)
        break;
        case 'right':
            return str.padStart(len);
        break;
        default:
            throw new Error(`Invalid alignment: ${align}`);
        break;
    };
};

export default alignString;