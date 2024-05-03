// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHmuB_-zGWZiWDzgT91ODJ-sCI0nhFm2U",
  authDomain: "facial-memory-study.firebaseapp.com",
  projectId: "facial-memory-study",
  storageBucket: "facial-memory-study.appspot.com",
  messagingSenderId: "507412989500",
  appId: "1:507412989500:web:dd1e0b0a172e0c68226539",
  measurementId: "G-05R8D3WH9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== 'undefined') {
   analytics = getAnalytics(app);
}
const db = getFirestore();
const auth = getAuth();

export { app, db, auth }