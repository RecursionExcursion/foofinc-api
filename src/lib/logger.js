const logger = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

/**
 *@param {string} text
 *@param {string} key
 *@returns {void}
 */
const log = (text, key = "log") => {
  if (!Object.keys(logger).includes(key)) {
    throw new Error(`Invalid key: ${key}`);
  }
  logger[key](text);
};

export default log;
