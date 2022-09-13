// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp  } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCXN6HJwkNNobFbigjk2845S6NCcp4UgXg",
  authDomain: "whatsapp-clone-2-419b3.firebaseapp.com",
  projectId: "whatsapp-clone-2-419b3",
  storageBucket: "whatsapp-clone-2-419b3.appspot.com",
  messagingSenderId: "1031475460692",
  appId: "1:1031475460692:web:d8d50e44f8457bebcb0bc1",
  measurementId: "G-J3LM31F73P"
};

const app =  !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {db, auth, provider};
