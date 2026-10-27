import {IonButton, IonContent, IonPage} from '@ionic/react';
import FunctionTesterContainer from '../components/FunctionTesterContainer';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonButton routerLink="/checkpoints">Checkpoints</IonButton>
        <FunctionTesterContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
