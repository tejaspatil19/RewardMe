/**
 * Logger utility for the application
 * Configurable logging levels and formatting
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor(level = 'INFO') {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Format log message with timestamp and level
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   * @returns {string} - Formatted message
   */
  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}${data ? ` - ${JSON.stringify(data)}` : ''}`;
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Error|any} error - Error object or additional data
   */
  error(message, error = null) {
    if (this.level >= LOG_LEVELS.ERROR) {
      const errorData = error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error;
      
      if (this.isDevelopment) {
        console.error(this.formatMessage('ERROR', message, errorData));
      } else {
        console.error(message, errorData);
      }
    }
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {any} data - Additional data
   */
  warn(message, data = null) {
    if (this.level >= LOG_LEVELS.WARN) {
      if (this.isDevelopment) {
        console.warn(this.formatMessage('WARN', message, data));
      } else {
        console.warn(message, data);
      }
    }
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {any} data - Additional data
   */
  info(message, data = null) {
    if (this.level >= LOG_LEVELS.INFO) {
      if (this.isDevelopment) {
        console.info(this.formatMessage('INFO', message, data));
      } else {
        console.info(message, data);
      }
    }
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {any} data - Additional data
   */
  debug(message, data = null) {
    if (this.level >= LOG_LEVELS.DEBUG && this.isDevelopment) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  /**
   * Log API call information
   * @param {string} method - HTTP method
   * @param {string} url - API URL
   * @param {any} response - API response
   */
  apiCall(method, url, response = null) {
    this.info(`API ${method.toUpperCase()} ${url}`, response ? { status: response.status } : null);
  }

  /**
   * Log performance metrics
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   */
  performance(operation, duration) {
    this.debug(`Performance: ${operation} completed in ${duration}ms`);
  }
}

// Create and export a default logger instance
const logger = new Logger(process.env.REACT_APP_LOG_LEVEL || 'INFO');

export default logger;