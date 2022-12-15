export default {
    jsc: {
        parser: {
            syntax: "typescript",
            tsx: true
        },
        target: "es2015",
        loose: false,
        minify: {
            "compress": false,
            "mangle": false
        }
    },
    module: {
        type: "commonjs"
    },
    minify: false,
    isModule: true
};