// ✅ Firebase core imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ✅ Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWZsxKzT8Fc-_aI9gbWhZogrvmANnS8Yg",
    authDomain: "canon-blomster.firebaseapp.com",
    projectId: "canon-blomster",
    storageBucket: "canon-blomster.appspot.com",
    messagingSenderId: "819646132514",
    appId: "1:819646132514:web:cfc43f1700e5aa8c46386d",
    measurementId: "G-4R2C7BCFZN"
};

// ✅ Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Optional debug log (can remove later)
console.log("🔥 Firebase initialized:", app.name);
