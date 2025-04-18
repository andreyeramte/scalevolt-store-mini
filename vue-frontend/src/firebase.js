import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDaSNuQkcB-x7Jw0-dg_tEk5fy23-fZLwA",
  authDomain: "sample-firebase-ai-app-a5d01.firebaseapp.com",
  projectId: "sample-firebase-ai-app-a5d01",
  storageBucket: "sample-firebase-ai-app-a5d01.firebasestorage.app",
  messagingSenderId: "383695387857",
  appId: "1:383695387857:web:51774f6d9fc52be16859f0",
  measurementId: "G-7Q3CGMR6Z6"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };