import type { CaptureContext, Hub } from '@sentry/types';
import * as Sentry from '@sentry/node';
import { initializeSentry } from './initializeSentry';

export default function SentryException(
  message: any,
  captureContext?: CaptureContext,
): ReturnType<Hub['captureMessage']> {
  initializeSentry();

  return Sentry.captureException(message, captureContext);
}
