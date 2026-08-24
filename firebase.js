import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendPasswordResetEmail,
  signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  collection, addDoc, query, where, orderBy, limit, getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  app, auth, db, storage,
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendPasswordResetEmail,
  signOut, updateProfile,
  doc, setDoc, getDoc, updateDoc, collection, addDoc,
  query, where, orderBy, limit, getDocs, serverTimestamp,
  ref, uploadBytes, getDownloadURL
};
