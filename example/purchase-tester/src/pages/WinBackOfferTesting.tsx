import { IonContent, IonPage } from '@ionic/react';
import WinBackOfferTestingContainer from '../components/WinBackOfferTestingContainer';

const WinBackOfferTesting: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <WinBackOfferTestingContainer />
      </IonContent>
    </IonPage>
  );
};

export default WinBackOfferTesting;
