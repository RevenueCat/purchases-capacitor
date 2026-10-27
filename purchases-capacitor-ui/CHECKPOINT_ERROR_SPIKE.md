# Custom checkpoint errors: WebView host spike

This is a throwaway proof, stacked on the native-default checkpoints implementation. It is not ready to ship as a supported custom-error API.

## Result

Capacitor can render app-owned DOM error UI above native UI by temporarily moving its existing WebView into a transparent native host. It keeps the same JavaScript runtime, Capacitor bridge, page and React state. After the app dismisses its error UI, the bridge restores the WebView before acknowledging the error.

The pinned native SDKs already accept an error presenter. This prototype uses PHC 19.17.0, iOS SDK 5.99.0 and Android SDK 10.30.0. It needs no changes to PHC, purchases-ios or purchases-android, and does not use the experimental `EmbeddedCheckpointProxy` from the RN/Flutter work.

On iOS, the host is an `overFullScreen` view controller presented above the SDK's controller. Capacitor uses the WebView as its root controller's view. UIKit may detach that view under a full-screen modal, leaving it without a superview. The host swaps in a placeholder root view while borrowing the WebView, then restores the original root and parent placement.

On Android, the host is a transparent Dialog above the native dialog. The same WebView is removed from its original parent, attached to the host, then returned with its original layout parameters.

## Prototype API

```ts
const remove = await RevenueCatUI.checkpoint(
  'upgrade',
  (result) => {
    // Continue only here.
  },
  {
    errorPresenter: ({ error, container }) =>
      new Promise<void>((resolve) => {
        const panel = document.createElement('div');
        const message = document.createElement('p');
        message.textContent = error.message;
        const button = document.createElement('button');
        button.textContent = 'OK';
        button.onclick = () => {
          panel.remove();
          resolve();
        };
        panel.append(message, button);
        container.append(panel);
      }),
  },
);
```

Mount UI inside the supplied `container`. A framework could use a portal into that container. The host temporarily hides the app's other top-level DOM nodes so the underlying native flow remains visible through the transparent WebView. Normal Ionic overlays that portal elsewhere have not been integrated.

Resolve the presenter's promise after dismissing its UI. Explicit `request.complete()` is also available and idempotent. Completion acknowledges the error; it does not choose a checkpoint outcome. Throwing, a failed native host, or detaching the callback releases pending acknowledgements. After detachment, later native error requests are acknowledged without showing app UI in this prototype.

When `errorPresenter` is omitted, the baseline uses the SDK's normal native presentation and error dialogs. `debugSimulateError: true` is a spike-only probe that shows a synthetic native modal and sends an error through the same host/acknowledgement path without configuring Purchases. Remove this diagnostic option before shipping.

## Evidence

- The baseline's 32 Jest tests pass with this branch. Seven DOM tests exercise mounting, normalization, dismissal, explicit completion, throwing, failed native hosting, early async rejection and cancellation while showing is pending.
- Both native bridges and the tester applications compile against the pinned dependencies.
- The iOS simulator UI test shows, taps and dismisses the custom DOM error three times, returning to the same page each time. Both full-screen and sheet synthetic modals passed.
- The Android API 34 UI test shows, taps and dismisses the custom DOM error three times, then returns to the same page.
- The final smoke tests also call the real native checkpoint method before configuration and assert its setup rejection. This verifies the native setup bridge without dashboard credentials.

The repeated synthetic probes are separate calls, not multiple serial errors inside one real checkpoint. They prove WebView layering, interactivity, acknowledgement and restoration. They do not prove a purchase failure inside a real dashboard-selected checkpoint. Native error-presenter adapters compile, but purchase/restore errors, post-flow sync failures and real workflow progression still need end-to-end testing.

The smoke fixtures and commands are in [the tester smoke harness](../example/purchase-tester/checkpoint-smoke/README.md). Screenshots and local build/test logs are saved in the workspace's ignored `.context/` directory.

## Before making this a supported API

- Own and restore the WebView across bridge reload, screen teardown, backgrounding, rotation, overlapping presentations and failed transitions. Native cancellation during an in-flight presentation transition remains unverified. The iOS spike has no bridge-reset cleanup hook yet.
- Coordinate with other plugins that present native UI or rely on the original root view hierarchy. Cover sheet/full-screen transitions and keyboard handling on real devices.
- Decide how framework-owned portals should render into the host. Add focus trapping, screen-reader focus restoration and Android back behavior. The probe's host disables native back dismissal.
- Decide the fallback when a caller detaches while the native flow remains open. Automatically acknowledging later errors prevents a hang but loses visible error reporting.
- Exercise real checkpoint purchase/restore failures, synchronization errors and cancellation. Keep the SDK responsible for whether a flow resumes, ends or passes.
- Replace the diagnostic API and global DOM-hiding CSS with an explicit, supported host contract. Bound request bookkeeping and avoid retaining finished requests for a long-lived checkpoint.
