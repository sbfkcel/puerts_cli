const env = process.env;
const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;

export default language && language.indexOf('EN') > -1 ? 'en' : 'cn';