
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3c2f4537b8cf4934ac7c1e914a5026f5',
  appName: 'green-trails',
  webDir: 'dist',
  server: {
    url: 'https://3c2f4537-b8cf-4934-ac7c-1e914a5026f5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#2E7D32",
      showSpinner: true,
      spinnerColor: "#ffffff",
      androidSpinnerStyle: "large",
    }
  }
};

export default config;
