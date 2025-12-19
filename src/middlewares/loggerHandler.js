const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

const requestLogger = (req, res, next) => {
  const start = Date.now();

  req.requestId = Math.random().toString(36).substring(2, 10);

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      `${req.requestId} | ${req.method} ${req.originalUrl} - ${res.statusCode} ` +
        `| ${duration}ms | IP: ${req.ip}`
    );
  });

  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error(
    `${req.requestId || "-"} | ERROR: ${err.message}\n` +
      `${err.stack ? err.stack : ""}`
  );
  next(err);
};

module.exports = { logger, requestLogger, errorLogger };
