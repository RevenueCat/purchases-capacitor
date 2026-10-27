export {};

type CheckpointEvent = { callId: string; result: unknown };
type CheckpointListener = (event: CheckpointEvent) => void;
const mockListeners = new Set<CheckpointListener>();
const mockRemove = jest.fn(async () => undefined);
const mockNative = {
  addListener: jest.fn(async (_event: string, listener: CheckpointListener) => {
    mockListeners.add(listener);
    return {
      remove: async () => {
        mockListeners.delete(listener);
        await mockRemove();
      },
    };
  }),
  checkpoint: jest.fn(async (_options: { callId: string }) => undefined),
};
let mockPlatform = 'ios';

jest.doMock(require.resolve('@capacitor/core', { paths: [`${__dirname}/../purchases-capacitor-ui`] }), () => ({
  ...jest.requireActual('@capacitor/core'),
  registerPlugin: () => mockNative,
  Capacitor: { getPlatform: () => mockPlatform },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RevenueCatUI, FLOW_PRESENTATION_MODE } = require('../purchases-capacitor-ui/src/index');

const result = { customer: { originalAppUserId: 'user' }, flow: null };
const callId = (index = 0) => mockNative.checkpoint.mock.calls[index][0].callId;
const emit = (id: string) => [...mockListeners].forEach((listener) => listener({ callId: id, result }));

beforeEach(() => {
  mockPlatform = 'ios';
  mockListeners.clear();
  jest.clearAllMocks();
});

it('passes primitive custom variables and the requested presentation mode', async () => {
  const remove = await RevenueCatUI.checkpoint('upgrade', jest.fn(), {
    customVariables: { name: 'Taylor', level: 12, premium: false },
    presentationMode: FLOW_PRESENTATION_MODE.MODAL_FULL_SCREEN,
  });
  expect(mockNative.checkpoint).toHaveBeenCalledWith({
    identifier: 'upgrade',
    customVariables: { name: 'Taylor', level: 12, premium: false },
    presentationMode: 'MODAL_FULL_SCREEN',
    callId: expect.any(String),
  });
  await remove();
});

it('routes each result once and detaches before invoking app code', async () => {
  const first = jest.fn(() => {
    expect(mockListeners.size).toBe(1);
  });
  const second = jest.fn();
  await RevenueCatUI.checkpoint('first', first);
  await RevenueCatUI.checkpoint('second', second);
  expect(mockNative.checkpoint.mock.calls[0][0]).toEqual({
    identifier: 'first',
    presentationMode: 'DEFAULT',
    callId: expect.any(String),
  });
  expect(callId(0)).not.toBe(callId(1));
  emit('unrelated');
  expect(first).not.toHaveBeenCalled();
  emit(callId());
  emit(callId());
  expect(first).toHaveBeenCalledTimes(1);
  expect(first).toHaveBeenCalledWith(result);
  expect(second).not.toHaveBeenCalled();
  emit(callId(1));
  expect(second).toHaveBeenCalledWith(result);
  expect(mockListeners.size).toBe(0);
});

it('can detach repeatedly and ignores late native results', async () => {
  const onPassed = jest.fn();
  const remove = await RevenueCatUI.checkpoint('upgrade', onPassed);
  await remove();
  await remove();
  emit(callId());
  expect(onPassed).not.toHaveBeenCalled();
  expect(mockListeners.size).toBe(0);
  expect(mockRemove).toHaveBeenCalledTimes(1);
});

it('installs the listener before native can immediately pass a checkpoint', async () => {
  mockNative.checkpoint.mockImplementationOnce(async ({ callId }) => {
    emit(callId);
  });
  const onPassed = jest.fn();
  await RevenueCatUI.checkpoint('no-matching-rule', onPassed);
  expect(onPassed).toHaveBeenCalledWith(result);
  expect(mockListeners.size).toBe(0);
});

it('does not invoke onPassed without a native pass event', async () => {
  const onPassed = jest.fn();
  const remove = await RevenueCatUI.checkpoint('upgrade', onPassed);
  expect(onPassed).not.toHaveBeenCalled();
  await remove();
});

it('cleans up the listener when native setup rejects', async () => {
  mockNative.checkpoint.mockRejectedValueOnce(new Error('Configure Purchases first'));
  await expect(RevenueCatUI.checkpoint('upgrade', jest.fn())).rejects.toThrow('Configure Purchases first');
  expect(mockListeners.size).toBe(0);
});

it('does not start native code if registering the listener fails', async () => {
  mockNative.addListener.mockRejectedValueOnce(new Error('registration failed'));
  await expect(RevenueCatUI.checkpoint('upgrade', jest.fn())).rejects.toThrow('registration failed');
  expect(mockNative.checkpoint).not.toHaveBeenCalled();
});

it('cleans up even when the app callback throws', async () => {
  await RevenueCatUI.checkpoint('upgrade', () => {
    throw new Error('app error');
  });
  expect(() => emit(callId())).toThrow('app error');
  expect(mockListeners.size).toBe(0);
  emit(callId());
});

it.each(['web', 'electron'])('rejects unsupported %s without registering listeners', async (platform) => {
  mockPlatform = platform;
  await expect(RevenueCatUI.checkpoint('upgrade', jest.fn())).rejects.toThrow(/native iOS or Android/);
  expect(mockNative.addListener).not.toHaveBeenCalled();
  expect(mockNative.checkpoint).not.toHaveBeenCalled();
});

it('rejects checkpoints in the web implementation even with mock results enabled', async () => {
  const { RevenueCatUIWeb } = await import('../purchases-capacitor-ui/src/web');
  const web = new RevenueCatUIWeb();
  await web.setMockWebResults({ shouldMockWebResults: true });
  const onPassed = jest.fn();
  await expect(web.checkpoint('upgrade', onPassed)).rejects.toThrow(/native iOS or Android/);
  expect(onPassed).not.toHaveBeenCalled();
});

it('starts checkpoints on Android', async () => {
  mockPlatform = 'android';
  const remove = await RevenueCatUI.checkpoint('upgrade', jest.fn());
  expect(mockNative.checkpoint).toHaveBeenCalledTimes(1);
  await remove();
});
