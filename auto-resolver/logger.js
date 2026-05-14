// Simple logger with file output
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'resolver.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

class Logger {
  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };

    // Console output
    const emoji = {
      INFO: 'ℹ️',
      SUCCESS: '✅',
      ERROR: '❌',
      WARN: '⚠️',
      RESOLVE: '🎯'
    }[level] || '📝';

    console.log(`${emoji} [${timestamp}] ${message}`, data.details ? `- ${JSON.stringify(data.details)}` : '');

    // File output
    try {
      // Check log file size
      if (fs.existsSync(LOG_FILE)) {
        const stats = fs.statSync(LOG_FILE);
        if (stats.size > MAX_LOG_SIZE) {
          // Rotate log file
          fs.renameSync(LOG_FILE, `${LOG_FILE}.old`);
        }
      }

      fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  static info(message, data) {
    this.log('INFO', message, data);
  }

  static success(message, data) {
    this.log('SUCCESS', message, data);
  }

  static error(message, data) {
    this.log('ERROR', message, data);
  }

  static warn(message, data) {
    this.log('WARN', message, data);
  }

  static resolve(message, data) {
    this.log('RESOLVE', message, data);
  }
}

module.exports = Logger;

