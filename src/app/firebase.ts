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
  apiKey: "AIzaSyC32D6giRsFctuzdCBoN15SyainCgrnK0k",
  authDomain: "orphan-face-recognition.firebaseapp.com",
  projectId: "orphan-face-recognition",
  storageBucket: "orphan-face-recognition.appspot.com",
  messagingSenderId: "943407788841",
  appId: "1:943407788841:web:c52001330d68097d9f3d38",
  measurementId: "G-2VSG80MPT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth }