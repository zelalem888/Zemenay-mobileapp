// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdEpztBmaexW10BKNrQD9mxk5KdOtWbhU",
  authDomain: "receipt-store-3cbde.firebaseapp.com",
  projectId: "receipt-store-3cbde",
  storageBucket: "receipt-store-3cbde.firebasestorage.app",
  messagingSenderId: "249467386673",
  appId: "1:249467386673:web:83fda53686146658108e10",
  measurementId: "G-KQDKEMYJHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };
