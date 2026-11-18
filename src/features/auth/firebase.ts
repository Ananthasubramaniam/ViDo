import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, type Auth } from 'firebase/auth';

export type AuthMode = 'firebase' | 'emulator' | 'unconfigured';

interface FirebaseInitResult {
  app: FirebaseApp | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
  authMode: AuthMode;
}

let cachedInit: FirebaseInitResult | null = null;

export function getFirebaseInstance(): FirebaseInitResult {
  if (cachedInit) {
    return cachedInit;
  }

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  const isConfigured = Boolean(apiKey && projectId && apiKey.trim() !== '' && projectId.trim() !== '');
  const wantsEmulator =
    import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' ||
    (projectId && projectId.startsWith('demo-')) ||
    (!isConfigured && !import.meta.env.PROD);

  // In production, if credentials are missing, do not attempt emulator connection
  if (import.meta.env.PROD && !isConfigured) {
    console.error('Firebase configuration keys are missing in production environment.');
    cachedInit = {
      app: null,
      auth: null,
      googleProvider: null,
      authMode: 'unconfigured',
    };
    return cachedInit;
  }

  try {
    const activeProjectId = projectId || 'demo-vido';
    const activeApiKey = apiKey || 'demo-api-key';

    const firebaseConfig = {
      apiKey: activeApiKey,
      authDomain: authDomain || `${activeProjectId}.firebaseapp.com`,
      projectId: activeProjectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    const existingApps = getApps();
    const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    let authMode: AuthMode = 'firebase';

    // In dev mode, connect to local Firebase CLI Auth Emulator on localhost:9099
    if (!import.meta.env.PROD && wantsEmulator) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        authMode = 'emulator';
      } catch (emulatorErr) {
        // connectAuthEmulator throws if already connected in Vite hot reload; safe to ignore
        console.warn('Firebase Auth Emulator connection notice:', emulatorErr);
        authMode = 'emulator';
      }
    }

    cachedInit = {
      app,
      auth,
      googleProvider,
      authMode,
    };
    return cachedInit;
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error);
    cachedInit = {
      app: null,
      auth: null,
      googleProvider: null,
      authMode: 'unconfigured',
    };
    return cachedInit;
  }
}
