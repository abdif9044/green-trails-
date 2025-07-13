
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.greentrails.hiking', // Production app ID for Play Store
  appName: 'GreenTrails',
  webDir: 'dist',
  server: {
    url: 'https://3c2f4537-b8cf-4934-ac7c-1e914a5026f5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'android/greentrails-release-key.keystore',
      keystoreAlias: 'greentrails-key',
      releaseType: 'AAB',
      signingType: 'apksigner'
    },
    minSdkVersion: 24,
    compileSdkVersion: 34,
    targetSdkVersion: 34, // Required for Play Store compliance
    versionCode: 1,
    versionName: '1.0.0',
    allowMixedContent: false,
    captureErrors: true,
    webContentsDebuggingEnabled: false // Disabled for production
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#2E7D32",
      showSpinner: true,
      spinnerColor: "#ffffff",
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    },
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
