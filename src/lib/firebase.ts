// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC7Cdsl0jrKxIGeOKbdzCQDPLn5NaC1poE",
//   authDomain: "remunavoicerkl.firebaseapp.com",
//   projectId: "remunavoicerkl",
//   storageBucket: "remunavoicerkl.firebasestorage.app",
//   messagingSenderId: "225057405832",
//   appId: "1:225057405832:web:717b49b134398b9fb3183d",
//   measurementId: "G-2NWQ2VBYL3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getFirestore(app);

// /lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7Cdsl0jrKxIGeOKbdzCQDPLn5NaC1poE",
  authDomain: "remunavoicerkl.firebaseapp.com",
  projectId: "remunavoicerkl",
  storageBucket: "remunavoicerkl.firebasestorage.app",
  messagingSenderId: "225057405832",
  appId: "1:225057405832:web:717b49b134398b9fb3183d",
  measurementId: "G-2NWQ2VBYL3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
