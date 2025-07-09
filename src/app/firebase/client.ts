import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage"; 
import { Firestore, getFirestore } from 'firebase/firestore';    

const firebaseConfig = {
  apiKey: "AIzaSyCtYsVRV3Mwki46rTfPeFehYmIhgm1eS2s",
  authDomain: "luathubs-2607.firebaseapp.com",
  projectId: "luathubs-2607",
  storageBucket: "luathubs-2607.firebasestorage.app",
  messagingSenderId: "818049966024",
  appId: "1:818049966024:web:9da33913f11a869a976afd",
  measurementId: "G-21VGR5Y8ZB"
};

const CurrentApps = getApps();

let auth: Auth;
let storage: FirebaseStorage;
let firestore: Firestore;

if (!CurrentApps.length) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    firestore = getFirestore(app);
} else {
    const app = CurrentApps[0];
    auth = getAuth(app);
    storage = getStorage(app);
    firestore = getFirestore(app);
}

export { auth, storage, firestore };

