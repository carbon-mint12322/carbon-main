import type { SeverityLevel, CaptureContext, Severity, Hub } from '@sentry/types';
import * as Sentry from '@sentry/node';
import { initializeSentry } from './initializeSentry';

export default function SentryMessage(
  message: string,
  captureContext?: SeverityLevel | CaptureContext | Severity,
): ReturnType<Hub['captureMessage']> {
  initializeSentry();
  console.log(message);
  return Sentry.captureMessage(message, captureContext);
}
