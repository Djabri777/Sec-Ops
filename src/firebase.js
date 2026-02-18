import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvQia9fpyIiiwDKB3vjjcrcJmF1m0PpMQ",
  authDomain: "sec-ops-5dcf1.firebaseapp.com",
  projectId: "sec-ops-5dcf1",
  storageBucket: "sec-ops-5dcf1.firebasestorage.app",
  messagingSenderId: "814658252902",
  appId: "1:814658252902:web:b5e86b44c1492686d7bda7",
  measurementId: "G-TJEWXNQHST"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
