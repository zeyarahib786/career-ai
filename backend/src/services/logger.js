'use strict';
const { createLogger, format, transports } = require('winston');
const DRF = require('winston-daily-rotate-file');
const cfg = require('../config/env');

const dev = cfg.isDev;
const fmt = dev
  ? format.combine(format.colorize(), format.timestamp({ format:'HH:mm:ss' }), format.errors({ stack:true }),
      format.printf(({ level, message, timestamp:ts, stack, ...m }) => {
        let o = `${ts} [${level}] ${message}`;
        if (stack) o += '\n' + stack;
        if (Object.keys(m).length) o += ' ' + JSON.stringify(m);
        return o;
      }))
  : format.combine(format.timestamp(), format.errors({ stack:true }), format.json());

const t = dev
  ? [new transports.Console({ format: fmt })]
  : [
      new transports.Console({ format: fmt }),
      new DRF({ filename:`${cfg.log.dir}/error-%DATE%.log`, datePattern:'YYYY-MM-DD', level:'error', maxFiles:'30d', format: fmt }),
      new DRF({ filename:`${cfg.log.dir}/combined-%DATE%.log`, datePattern:'YYYY-MM-DD', maxFiles:'14d', format: fmt }),
    ];

module.exports = createLogger({ level: cfg.log.level, transports: t, exitOnError: false });
