'use strict';
const mongoose = require('mongoose');
const config   = require('./env');
const logger   = require('../services/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    mongoose.connection.on('error', err => logger.error('MongoDB error', { error: err.message }));
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB disconnected cleanly');
};

module.exports = { connectDB, disconnectDB };
