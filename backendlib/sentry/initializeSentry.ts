import * as Sentry from '@sentry/node';

export function initializeSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_URL || '',
  });
}
