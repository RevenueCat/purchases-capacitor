import {IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import FunctionTesterContainer from '../components/FunctionTesterContainer';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Purchase tester</IonTitle>
          <IonButtons slot="end"><IonButton routerLink="/checkpoints">Checkpoints</IonButton></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <FunctionTesterContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
