const logger = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

const log = (text: string, key: keyof typeof logger = "log") => logger[key](text);

export default log;
