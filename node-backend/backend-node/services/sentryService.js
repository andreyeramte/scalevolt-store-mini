const Sentry = require('@sentry/node');
require('dotenv').config();

class SentryService {
    constructor() {
        this.dsn = process.env.SENTRY_DSN;
        this.environment = process.env.NODE_ENV || 'development';
        this.enabled = process.env.ENABLE_SENTRY === 'true' && this.dsn;
        
        if (this.enabled) {
            this.initialize();
        }
    }

    initialize() {
        Sentry.init({
            dsn: this.dsn,
            environment: this.environment,
            tracesSampleRate: 1.0,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }),
                new Sentry.Integrations.Express({ app: null })
            ]
        });
    }

    captureException(error, context = {}) {
        if (!this.enabled) return;
        
        Sentry.withScope(scope => {
            Object.entries(context).forEach(([key, value]) => {
                scope.setExtra(key, value);
            });
            Sentry.captureException(error);
        });
    }

    captureMessage(message, level = 'info', context = {}) {
        if (!this.enabled) return;
        
        Sentry.withScope(scope => {
            Object.entries(context).forEach(([key, value]) => {
                scope.setExtra(key, value);
            });
            Sentry.captureMessage(message, level);
        });
    }

    setUser(user) {
        if (!this.enabled) return;
        Sentry.setUser(user);
    }

    setTag(key, value) {
        if (!this.enabled) return;
        Sentry.setTag(key, value);
    }

    setContext(name, context) {
        if (!this.enabled) return;
        Sentry.setContext(name, context);
    }
}

module.exports = new SentryService();
