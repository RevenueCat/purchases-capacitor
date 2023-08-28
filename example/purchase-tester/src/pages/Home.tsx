import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import FunctionTesterContainer from '../components/FunctionTesterContainer';
import './Home.css';

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
