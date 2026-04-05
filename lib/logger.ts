type LogLevel = 'info' | 'warn' | 'error' | 'perf';

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const payload = { timestamp, level, message, ...data };

    if (this.isDev) {
      const colors = {
        info: '\x1b[34m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        perf: '\x1b[32m',
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${message}`, data || '');
    }

    // In a real production SaaS, you would send this to Sentry, Axiom, or Datadog
    if (level === 'error') {
      // this.sendToMonitoringService(payload);
    }
  }

  perf(metric: string, duration: number) {
    this.log('perf', `${metric} took ${duration.toFixed(2)}ms`);
  }
}

export const logger = new Logger();
