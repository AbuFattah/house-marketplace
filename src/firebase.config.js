import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDqOuf-vv237BQJHBt7OTGoriUip8iXq0E",
  authDomain: "house-market-place-app-2294a.firebaseapp.com",
  projectId: "house-market-place-app-2294a",
  storageBucket: "house-market-place-app-2294a.appspot.com",
  messagingSenderId: "463683614002",
  appId: "1:463683614002:web:c055d4a5ff35eef661532b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore();
