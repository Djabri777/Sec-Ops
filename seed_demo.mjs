import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBvQia9fpyIiiwDKB3vjjcrcJmF1m0PpMQ",
  authDomain: "sec-ops-5dcf1.firebaseapp.com",
  projectId: "sec-ops-5dcf1",
  storageBucket: "sec-ops-5dcf1.firebasestorage.app",
  messagingSenderId: "814658252902",
  appId: "1:814658252902:web:b5e86b44c1492686d7bda7",
};

const app = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

const DEMO_ACCOUNTS = [
  { email: 'client@gmail.com',  password: '123456' },
  { email: 'client2@gmail.com', password: '123456' },
  { email: 'client3@gmail.com', password: '123456' },
];

for (const { email, password } of DEMO_ACCOUNTS) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid  = cred.user.uid;

    const snap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));

    if (snap.empty) {
      console.log(`  NOT FOUND in Firestore: ${email}`);
    } else {
      for (const docSnap of snap.docs) {
        await updateDoc(docSnap.ref, {
          subscriptionActive: true,
          subscriptionPlan: 'enterprise',
          subscriptionExpires: '2027-12-31',
          serviceType: 'enterprise',
        });
      }
      console.log(`  ✓ Activated: ${email} (uid: ${uid})`);
    }

    await signOut(auth);
  } catch (e) {
    console.log(`  ✗ Failed: ${email} — ${e.message}`);
  }
}

console.log('\nDone.');
process.exit(0);
