/* istanbul ignore file */
import log from "loglevel";

// Set log level (can be "trace", "debug", "info", "warn", "error", "silent")
const isDev = process.env.NODE_ENV === "development";
log.setLevel(isDev ? "debug" : "error"); // show debug in dev, errors in prod

export default log;
