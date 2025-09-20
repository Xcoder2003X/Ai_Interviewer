// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBAMx_AQea2xUELawTAZpXlqcejWQhQqE",
  authDomain: "interviewprepa.firebaseapp.com",
  projectId: "interviewprepa",
  storageBucket: "interviewprepa.firebasestorage.app",
  messagingSenderId: "752961182617",
  appId: "1:752961182617:web:79acccdad2a65a13f05108",
  measurementId: "G-88440CXMY3"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);