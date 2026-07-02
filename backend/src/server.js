'use strict';
require('./config/env');
const app                   = require('./app');
const config                = require('./config/env');
const { connectDB, disconnectDB } = require('./config/database');
const logger                = require('./services/logger');

(async () => {
  await connectDB();
  const server = app.listen(config.port, () => {
    logger.info('Server running', { env:config.env, port:config.port, api:`/api/${config.apiVersion}` });
  });

  const shutdown = async signal => {
    logger.info(`${signal} received — graceful shutdown`);
    server.close(async () => {
      await disconnectDB();
      logger.info('Server closed');
      process.exit(0);
    });
    setTimeout(() => { logger.error('Forced shutdown'); process.exit(1); }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('unhandledRejection', reason => logger.error('Unhandled rejection', { reason:String(reason) }));
})();
