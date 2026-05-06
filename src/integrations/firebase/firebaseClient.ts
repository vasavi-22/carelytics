import { getAuth, type Auth } from "firebase/auth";
import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getFirebaseConfigFromEnv } from "./firebaseConfig";

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseOptions(): FirebaseOptions {
  const cfg = getFirebaseConfigFromEnv();
  return {
    apiKey: cfg.apiKey,
    authDomain: cfg.authDomain,
    projectId: cfg.projectId,
    storageBucket: cfg.storageBucket,
    messagingSenderId: cfg.messagingSenderId,
    appId: cfg.appId,
    measurementId: cfg.measurementId,
  };
}

export function getAuthInstance(): Auth {
  if (auth) return auth;

  if (!firebaseApp) {
    const options = getFirebaseOptions();
    firebaseApp = initializeApp(options);
  }

  auth = getAuth(firebaseApp);
  return auth;
}

