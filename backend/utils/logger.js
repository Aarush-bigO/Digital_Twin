/**
 * Production Structured JSON Clinical Logger
 */

const logLevels = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

const formatMessage = (level, message, metadata = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    pid: process.pid,
    environment: process.env.NODE_ENV || "development",
    ...metadata,
  });
};

export const logger = {
  info: (msg, meta) => console.log(formatMessage(logLevels.INFO, msg, meta)),
  warn: (msg, meta) => console.warn(formatMessage(logLevels.WARN, msg, meta)),
  error: (msg, meta) => console.error(formatMessage(logLevels.ERROR, msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage(logLevels.DEBUG, msg, meta));
    }
  },
};

export default logger;
