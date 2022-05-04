// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4OtHBLtsTRJHay8xVnVaMb04WnFVIPnc",
  authDomain: "marta-train.firebaseapp.com",
  projectId: "marta-train",
  storageBucket: "marta-train.appspot.com",
  messagingSenderId: "278452288208",
  appId: "1:278452288208:web:42560609478a4b3498bcd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);