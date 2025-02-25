import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyCIjQ5Wr9gzFTB2RniLVH1cvtLYWz5bvaQ",
    authDomain: "to-do-list-4282e.firebaseapp.com",
    projectId: "to-do-list-4282e",
    storageBucket: "to-do-list-4282e.firebasestorage.app",
    messagingSenderId: "542102435281",
    appId: "1:542102435281:web:4c09319d7f2217e613dcf0",
    measurementId: "G-NYFNX7HBHC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; // Exportando app corretamente

