import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // TODO: Replace with your actual Firebase config
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export default app;

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { app, auth, db };