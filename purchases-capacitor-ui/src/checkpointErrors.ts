import type { PurchasesError } from '@revenuecat/purchases-typescript-internal-esm';
import { normalizePurchasesError } from '@revenuecat/purchases-typescript-internal-esm';

import type { CheckpointErrorKind, CheckpointErrorPresenter } from './definitions';

/** Throwaway spike: renders app error UI in the existing WebView above the native flow. */
export function presentCheckpointError(
  event: { callId: string; requestId: string; kind: CheckpointErrorKind; error: unknown },
  presenter: CheckpointErrorPresenter,
  native: {
    showCheckpointError(options: { callId: string; requestId: string }): Promise<void>;
    completeCheckpointError(options: { callId: string; requestId: string }): Promise<void>;
  },
): { cancel: () => Promise<void>; finished: Promise<void> } {
  const container = document.createElement('div');
  container.dataset.rcCheckpointErrorHost = '';
  container.style.cssText = 'position:fixed;inset:0;z-index:2147483647;visibility:visible;';
  const style = document.createElement('style');
  style.textContent = `html,body { background:transparent !important; }
    body > :not([data-rc-checkpoint-error-host]) { visibility:hidden !important; }`;
  document.head.appendChild(style);
  document.body.appendChild(container);
  let completion: Promise<void> | undefined;
  let cancelPresentation: () => void = () => undefined;
  const cancelled = new Promise<void>((resolve) => {
    cancelPresentation = resolve;
  });
  const complete = (): Promise<void> => {
    if (!completion) {
      container.remove();
      style.remove();
      cancelPresentation();
      completion = native.completeCheckpointError({ callId: event.callId, requestId: event.requestId });
    }
    return completion;
  };
  const finished = (async () => {
    try {
      const presented = presenter({
        requestId: event.requestId,
        kind: event.kind,
        error: normalizePurchasesError(event.error) as PurchasesError,
        container,
        complete,
      });
      // Handle rejection immediately even while UIKit/Android is still opening its host.
      // The original promise is awaited below so the caller still sees the failure.
      void presented.catch(() => undefined);
      // The app has mounted its DOM before the native WebView is moved above the flow.
      if (!completion) {
        await Promise.race([
          native.showCheckpointError({ callId: event.callId, requestId: event.requestId }),
          cancelled,
        ]);
      }
      await Promise.race([presented, cancelled]);
    } finally {
      await complete();
    }
  })();
  return { cancel: complete, finished };
}
