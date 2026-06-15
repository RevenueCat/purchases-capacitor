import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonActionSheet,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Purchases } from '@revenuecat/purchases-capacitor';
import type { PurchasesOffering } from '@revenuecat/purchases-capacitor';

const CustomPaywallImpressionTestingScreen: React.FC = () => {
  const [paywallId, setPaywallId] = useState('');
  const [currentOfferingId, setCurrentOfferingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [presentAlert] = useIonAlert();
  const [presentActionSheet] = useIonActionSheet();

  useEffect(() => {
    void loadOfferings();
  }, []);

  const trimmedPaywallId = () => {
    const trimmedValue = paywallId.trim();
    return trimmedValue.length > 0 ? trimmedValue : undefined;
  };

  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    setCurrentOfferingId(offerings.current?.identifier ?? null);
    return offerings;
  };

  const trackImpressionWithoutOffering = async () => {
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const offerings = await loadOfferings();
      const currentOffering = offerings.current;
      const currentPaywallId = trimmedPaywallId();

      if (!currentOffering) {
        setStatus('No current offering configured. The native SDK cannot infer an offering for this call.');
        await presentAlert({
          header: 'No current offering configured',
          message:
            'The native SDK can only infer an offering when getOfferings().current is non-null. Use Track with Offering for this project.',
          buttons: ['OK'],
        });
        return;
      }

      if (currentPaywallId) {
        await Purchases.trackCustomPaywallImpression({ paywallId: currentPaywallId });
      } else {
        await Purchases.trackCustomPaywallImpression();
      }

      setStatus(
        `Tracked without offering (paywallId: ${currentPaywallId ?? 'nil'}, current offering: ${currentOffering.identifier})`,
      );
    } catch (e) {
      setError(`${e}`);
    } finally {
      setLoading(false);
    }
  };

  const trackImpressionWithOffering = async (offering: PurchasesOffering) => {
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const currentPaywallId = trimmedPaywallId();

      await Purchases.trackCustomPaywallImpression({
        paywallId: currentPaywallId,
        offering,
      });

      setStatus(`Tracked with offering: ${offering.identifier} (paywallId: ${currentPaywallId ?? 'nil'})`);
    } catch (e) {
      setError(`${e}`);
    } finally {
      setLoading(false);
    }
  };

  const showOfferingPicker = async () => {
    setLoading(true);
    setStatus('Loading offerings...');
    setError(null);

    try {
      const offerings = await loadOfferings();
      const offeringOptions = Object.values(offerings.all).sort((a, b) => a.identifier.localeCompare(b.identifier));

      setLoading(false);

      if (offeringOptions.length === 0) {
        setStatus('No offerings available');
        return;
      }

      await presentActionSheet({
        header: 'Select Offering',
        buttons: [
          ...offeringOptions.map((offering) => ({
            text: offering.identifier,
            handler: () => {
              void trackImpressionWithOffering(offering);
            },
          })),
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setStatus(null);
            },
          },
        ],
      });
    } catch (e) {
      setError(`${e}`);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Custom Paywall Impression Testing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          <IonText>
            <h1>Custom Paywall Impression</h1>
            <p>Use this screen to test tracking custom paywall impressions.</p>
            <p>Current offering: {currentOfferingId ?? 'nil'}</p>
          </IonText>

          <IonList inset>
            <IonItem>
              <IonLabel position="stacked">Paywall ID</IonLabel>
              <IonInput
                value={paywallId}
                placeholder="Optional, leave empty for none"
                onIonInput={(event) => setPaywallId(event.detail.value ?? '')}
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" disabled={loading} onClick={trackImpressionWithoutOffering}>
            Track without Offering
          </IonButton>
          <IonButton expand="block" disabled={loading} onClick={showOfferingPicker}>
            Track with Offering
          </IonButton>

          {status && (
            <IonCard color="success">
              <IonCardContent>{status}</IonCardContent>
            </IonCard>
          )}

          {error && (
            <IonCard color="danger">
              <IonCardContent>Error: {error}</IonCardContent>
            </IonCard>
          )}
        </div>

        <IonLoading isOpen={loading} message="Loading..." />
      </IonContent>
    </IonPage>
  );
};

export default CustomPaywallImpressionTestingScreen;
