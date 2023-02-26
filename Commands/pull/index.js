import fs from 'node:fs';
import path from 'node:path';
import getPathInfo from '../../lib/getPathInfo.js';
import isTsAndJs from '../../lib/isTsAndJs.js';
import buildFile from '../../lib/buildFile.js';
import line from '../../lib/getLine.js';
import createLang from '../../lib/createLang.js';
import createDebugers from '../../lib/createDebugers.js';
import findPath from '../../lib/findPath.js';

// https://api.github.com/repos/Kitware/CMake/releases/latest



const pullPuerts = async(argObj)=>{
    console.log(argObj);
};

export default pullPuerts;