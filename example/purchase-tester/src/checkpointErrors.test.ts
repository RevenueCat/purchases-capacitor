// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { presentCheckpointError } from '../../../purchases-capacitor-ui/src/checkpointErrors';
import type { CheckpointErrorPresenter } from '../../../purchases-capacitor-ui/src/definitions';

const event = { callId: 'call-1', requestId: 'error-1', kind: 'flowActionFailed' as const,
  error: { code: 1, message: 'Cancelled', readableErrorCode: 'PURCHASE_CANCELLED_ERROR' } };
const native = () => ({ showCheckpointError: vi.fn(async (): Promise<void> => undefined), completeCheckpointError: vi.fn(async (): Promise<void> => undefined) });
afterEach(() => { document.body.replaceChildren(); document.head.querySelectorAll('style').forEach(style => style.remove()); });

describe('custom checkpoint DOM error host spike', () => {
  it('gives the app a DOM container and normalized error, then removes its host on dismissal', async () => {
    const plugin = native();
    let dismiss = () => {};
    let errorCode: unknown;
    let host: HTMLElement | undefined;
    const request = presentCheckpointError(event, input => {
      host = input.container;
      errorCode = input.error.code;
      input.container.textContent = input.error.message;
      return new Promise(resolve => { dismiss = resolve; });
    }, plugin);
    expect(errorCode).toBe('1');
    expect(host?.isConnected).toBe(true);
    expect(document.body.textContent).toBe('Cancelled');
    dismiss();
    await request.finished;
    expect(host?.isConnected).toBe(false);
    expect(document.head.querySelector('style')).toBeNull();
    expect(plugin.completeCheckpointError).toHaveBeenCalledTimes(1);
  });

  it('releases an error if app presentation throws', async () => {
    const plugin = native();
    const request = presentCheckpointError(event, () => { throw new Error('app error'); }, plugin);
    await expect(request.finished).rejects.toThrow('app error');
    expect(document.body.children.length).toBe(0);
    expect(plugin.completeCheckpointError).toHaveBeenCalledTimes(1);
  });

  it('cancels a presenter that never resolves and completes natively only once', async () => {
    const plugin = native();
    const request = presentCheckpointError(event, () => new Promise(() => {}), plugin);
    await request.cancel();
    await request.cancel();
    await request.finished;
    expect(document.body.children.length).toBe(0);
    expect(plugin.completeCheckpointError).toHaveBeenCalledTimes(1);
  });

  it('cleans up if the native host cannot be shown', async () => {
    const plugin = native();
    plugin.showCheckpointError.mockRejectedValueOnce(new Error('host unavailable'));
    const request = presentCheckpointError(event, () => new Promise(() => {}), plugin);
    await expect(request.finished).rejects.toThrow('host unavailable');
    expect(document.body.children.length).toBe(0);
    expect(plugin.completeCheckpointError).toHaveBeenCalledTimes(1);
  });

  it('supports explicit synchronous completion without opening a native host', async () => {
    const plugin = native();
    const presenter: CheckpointErrorPresenter = request => request.complete();
    await presentCheckpointError(event, presenter, plugin).finished;
    expect(plugin.showCheckpointError).not.toHaveBeenCalled();
    expect(plugin.completeCheckpointError).toHaveBeenCalledTimes(1);
  });
  it('handles an async presenter rejection while native presentation is pending', async () => {
    const plugin = native();
    let shown = () => {};
    plugin.showCheckpointError.mockImplementationOnce(() => new Promise<void>(resolve => { shown = resolve; }));
    const request = presentCheckpointError(event, () => Promise.reject(new Error('async app error')), plugin);
    // Let rejection reporting run before UIKit's presentation completion arrives.
    await new Promise(resolve => setTimeout(resolve, 10));
    shown();
    await expect(request.finished).rejects.toThrow('async app error');
    expect(document.body.children.length).toBe(0);
    expect(plugin.completeCheckpointError).toHaveBeenCalledTimes(1);
  });

  it('settles cancellation even if the native show callback never arrives', async () => {
    const plugin = native();
    plugin.showCheckpointError.mockImplementationOnce(() => new Promise<void>(() => {}));
    const request = presentCheckpointError(event, () => new Promise<void>(() => {}), plugin);
    await request.cancel();
    const settled = await Promise.race([
      request.finished.then(() => true),
      new Promise(resolve => setTimeout(() => resolve(false), 20)),
    ]);
    expect(settled).toBe(true);
    expect(document.body.children.length).toBe(0);
  });

});
