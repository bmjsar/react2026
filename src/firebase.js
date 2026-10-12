import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBOovJceQCTBiCOEZKKr3kZdbkyRkgvwHw",
    authDomain: "proyectofaro-c508f.firebaseapp.com",
    projectId: "proyectofaro-c508f",
    storageBucket: "proyectofaro-c508f.firebasestorage.app",
    messagingSenderId: "349142916490",
    appId: "1:349142916490:web:ed5eda127cf66833917c73"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);