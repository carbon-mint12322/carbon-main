// For some reason, importing like below
// does not work. Google Login dialog says "The requested action is invalid."
// export {getAuth} from "@carbonmint/nextjs-middleware/src/lib/auth/initAuth";

import once from 'lodash/once';
import { initializeApp } from 'firebase/app';
import { getAuth as fbGetAuth } from 'firebase/auth';

export const getAuth = once(() => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  return fbGetAuth(app);
});
