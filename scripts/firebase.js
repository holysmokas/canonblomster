// scripts/firebase.js
// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


// ✅ Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZWzsKzT8Fc-_aI9gbWhZogrvmAmNs8Yg",
    authDomain: "canon-blomster.firebaseapp.com",
    projectId: "canon-blomster",
    storageBucket: "canon-blomster.appspot.com", // ✅ corrected
    messagingSenderId: "549469063023",
    appId: "1:549469063023:web:35cbf9a9c84af8c1e70a9a",
    measurementId: "G-B1VLK21EH1"
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
