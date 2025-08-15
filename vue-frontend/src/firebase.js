import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration with proper environment variables
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field].includes('placeholder'));
  
  if (missingFields.length > 0) {
    console.warn('⚠️ Firebase configuration incomplete - running in development mode without Firebase');
    console.warn('⚠️ Please check your .env file and ensure all Firebase variables are set');
    return false;
  }
  
  return true;
};

// Initialize Firebase only if configuration is valid
let app = null;
let auth = null;
let db = null;

try {
  if (validateFirebaseConfig()) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence);
    db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('🔐 Auth domain:', firebaseConfig.authDomain);
    console.log('📦 Project ID:', firebaseConfig.projectId);
  } else {
    console.warn('⚠️ Firebase not initialized - missing configuration');
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.warn('⚠️ Running without Firebase authentication');
}

export { app, auth, db };