
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt8gM1GhSp4VV10f481DkICap8cJsYVTs",
  authDomain: "vastra-4f656.firebaseapp.com",
  projectId: "vastra-4f656",
  storageBucket: "vastra-4f656.firebasestorage.app",
  messagingSenderId: "691916834683",
  appId: "1:691916834683:web:e6244e3ef4cd054a105fde",
  measurementId: "G-PLE2KN05P4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

