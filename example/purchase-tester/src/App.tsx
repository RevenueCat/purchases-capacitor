import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import type { ComponentType } from 'react';
import { Route, type RouteProps } from 'react-router-dom';
import CustomPaywallImpressionTestingScreen from './pages/CustomPaywallImpressionTestingScreen';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const RouterRoute = Route as unknown as ComponentType<RouteProps>;

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <RouterRoute exact path="/" component={Home} />
        <RouterRoute exact path="/custom-paywall-impression" component={CustomPaywallImpressionTestingScreen} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
