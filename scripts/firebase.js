import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAZWzsKzT8Fc-_aI9gbWhZogrvmAmNs8Yg",
    authDomain: "canon-blomster.firebaseapp.com",
    projectId: "canon-blomster",
    storageBucket: "canon-blomster.firebasestorage.app",
    messagingSenderId: "549469063023",
    appId: "1:549469063023:web:35cbf9a9c84af8c1e70a9a",
    measurementId: "G-B1VLK21EH1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
