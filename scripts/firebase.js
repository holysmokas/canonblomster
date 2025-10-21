// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ✅ Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZWzsKzT8Fc-_aI9gbWhZogrvmAmNs8Yg",
    authDomain: "canon-blomster.firebaseapp.com",
    projectId: "canon0-blomster",
    storageBucket: "canon-blomser.appspot.com",
    messagingSenderId: "549469063023",
    appId: "1:549469063023:web:35cbf9a9c84af8c1e70a9a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for reuse
export const auth = getAuth(app);
export const db = getFirestore(app, "europe-north2");



// Export Firebase helper functions (optional convenience)
export {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
};
