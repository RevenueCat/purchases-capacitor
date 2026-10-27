import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput,
  IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { RevenueCatUI, FLOW_PRESENTATION_MODE } from '@revenuecat/purchases-capacitor-ui';

const CheckpointsScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('upgrade');
  const [mode, setMode] = useState(FLOW_PRESENTATION_MODE.DEFAULT);
  const [log, setLog] = useState<string[]>([]);
  const removers = useRef(new Set<() => Promise<void>>());
  const mounted = useRef(true);
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

  const run = async () => {
    append(`Starting ${identifier} (${mode})`);
    let passed = false;
    let remove: (() => Promise<void>) | undefined;
    try {
      remove = await RevenueCatUI.checkpoint(identifier, result => {
        passed = true;
        append(`Passed: ${JSON.stringify(result)}`);
        if (remove) removers.current.delete(remove);
      }, { customVariables: { source: 'capacitor-tester', level: 12, premium: false }, presentationMode: mode });
      if (!mounted.current || passed) await remove();
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
        <p>Experimental, invite-only. Configure Purchases on the home screen first. Native dialogs handle errors.</p>
        <IonItem><IonLabel position="stacked">Checkpoint identifier</IonLabel>
          <IonInput value={identifier} onIonInput={event => setIdentifier(event.detail.value ?? '')} />
        </IonItem>
        <IonItem><IonLabel>Presentation</IonLabel>
          <IonSelect value={mode} onIonChange={event => setMode(event.detail.value)}>
            {Object.values(FLOW_PRESENTATION_MODE).map(value => <IonSelectOption key={value} value={value}>{value}</IonSelectOption>)}
          </IonSelect>
        </IonItem>
        <IonButton onClick={() => { void run(); }}>Run checkpoint</IonButton>
        <IonButton onClick={() => {
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
