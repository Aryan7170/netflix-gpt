// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMck6CdUJJAEhyFYSt6ZPkRONBKn_TmDE",
  authDomain: "netflixgpt-10c1a.firebaseapp.com",
  projectId: "netflixgpt-10c1a",
  storageBucket: "netflixgpt-10c1a.firebasestorage.app",
  messagingSenderId: "499265860537",
  appId: "1:499265860537:web:c0ef8961b7a4c43a593c68",
  measurementId: "G-RH6ZS2LSQ3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
