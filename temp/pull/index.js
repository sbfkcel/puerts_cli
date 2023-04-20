import { githubInfo, upmInfo } from '../../lib/getPuerInfo.js';

const pullPuerts = async (argObj) => {
    console.log(await upmInfo());
};

export default pullPuerts;
