import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput,
  IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, IonToggle,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { RevenueCatUI, FLOW_PRESENTATION_MODE, type CheckpointErrorPresenter } from '@revenuecat/purchases-capacitor-ui';

const CheckpointsScreen: React.FC = () => {
  const [customErrors, setCustomErrors] = useState(false);
  const [identifier, setIdentifier] = useState('upgrade');
  const [mode, setMode] = useState(FLOW_PRESENTATION_MODE.DEFAULT);
  const [log, setLog] = useState<string[]>([]);
  const removers = useRef(new Set<() => Promise<void>>());
  const mounted = useRef(true);
  const detachGeneration = useRef(0);
  const append = (message: string) => {
    if (mounted.current) setLog(current => [message, ...current].slice(0, 30));
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      removers.current.forEach(remove => { void remove(); });
      removers.current.clear();
    };
  }, []);

  const presentError: CheckpointErrorPresenter = request => new Promise<void>(resolve => {
    append(`Custom error: ${request.kind}, ${request.error.code}`);
    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.45)';
    const panel = document.createElement('div');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'App-owned checkpoint error');
    panel.style.cssText = 'background:white;color:#111;border-radius:16px;padding:24px;max-width:420px;font:17px system-ui;box-shadow:0 12px 40px #0005';
    const title = document.createElement('h2');
    title.textContent = 'App-owned DOM error';
    const message = document.createElement('p');
    message.textContent = request.error.message;
    const button = document.createElement('button');
    button.textContent = 'Acknowledge error';
    button.style.cssText = 'background:#1769e0;color:white;border:0;border-radius:8px;padding:14px;font:17px system-ui';
    button.onclick = () => {
      backdrop.remove();
      append('DOM error dismissed. Native acknowledgement follows.');
      resolve();
    };
    panel.append(title, message, button);
    backdrop.append(panel);
    request.container.append(backdrop);
    button.focus();
  });

  const run = async (probe = false) => {
    append(`Starting ${identifier} (${mode})`);
    const generation = detachGeneration.current;
    let passed = false;
    let remove: (() => Promise<void>) | undefined;
    try {
      remove = await RevenueCatUI.checkpoint(identifier, result => {
        passed = true;
        if (!mounted.current || generation !== detachGeneration.current) return;
        append(`Passed: ${JSON.stringify(result)}`);
        if (remove) removers.current.delete(remove);
      }, { customVariables: { source: 'capacitor-tester', level: 12, premium: false }, presentationMode: mode,
        ...(customErrors || probe ? { errorPresenter: presentError, debugSimulateError: probe } : {}) });
      if (!mounted.current || passed || generation !== detachGeneration.current) await remove();
      else removers.current.add(remove);
      append('Setup completed. Waiting for onPassed.');
    } catch (error) {
      append(`Setup failed: ${String(error)}`);
    }
  };
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/" /></IonButtons>
        <IonTitle>Checkpoints</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <p>Experimental, invite-only. Configure Purchases on the home screen first. Choose native dialogs or the experimental app-owned DOM presenter.</p>
        <IonItem><IonLabel position="stacked">Checkpoint identifier</IonLabel>
          <IonInput value={identifier} onIonInput={event => setIdentifier(event.detail.value ?? '')} />
        </IonItem>
        <IonItem><IonLabel>Presentation</IonLabel>
          <IonSelect value={mode} onIonChange={event => setMode(event.detail.value)}>
            {Object.values(FLOW_PRESENTATION_MODE).map(value => <IonSelectOption key={value} value={value}>{value}</IonSelectOption>)}
          </IonSelect>
        </IonItem>
        <IonItem><IonLabel>Custom DOM errors (spike)</IonLabel><IonToggle checked={customErrors} onIonChange={event => setCustomErrors(event.detail.checked)} /></IonItem>
        <IonButton onClick={() => { void run(true); }}>Test error host (synthetic modal)</IonButton>
        <IonButton onClick={() => { void run(); }}>Run checkpoint</IonButton>
        <IonButton onClick={() => {
          detachGeneration.current += 1;
          removers.current.forEach(remove => { void remove(); });
          removers.current.clear();
          append('Callbacks detached. Native UI is not dismissed.');
        }}>Detach callbacks</IonButton>
        {log.map((message, index) => <pre key={index} style={{ whiteSpace: 'pre-wrap' }}>{message}</pre>)}
      </IonContent>
    </IonPage>
  );
};
export default CheckpointsScreen;
