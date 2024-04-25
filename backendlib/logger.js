import winston from 'winston';
const { combine, timestamp, label, prettyPrint, colorize } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(colorize(), timestamp(), prettyPrint()),
  defaultMeta: { service: process.env.TENANT_NAME || 'reactml-dev' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to
    // - `error.log` Write all logs with importance level of `info` or
    // - less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default function (name) {
  // set the default moduleName of the child
  return logger.child({ moduleName: name });
}
