import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'purchase-tester',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
