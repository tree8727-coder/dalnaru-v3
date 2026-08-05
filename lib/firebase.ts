import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh_deQwmKC8_iHa9uUn5-u9TJr-s7FGng",
  authDomain: "dalnaru.firebaseapp.com",
  projectId: "dalnaru",
  storageBucket: "dalnaru.firebasestorage.app",
  messagingSenderId: "464527963320",
  appId: "1:464527963320:web:854efde70bcfb721cef04d",
  measurementId: "G-DLEFZWSEHZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInWithPopup, GoogleAuthProvider, signOut, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove };
