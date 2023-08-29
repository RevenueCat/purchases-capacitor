import {IonContent, IonPage} from '@ionic/react';
import FunctionTesterContainer from '../components/FunctionTesterContainer';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <FunctionTesterContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
