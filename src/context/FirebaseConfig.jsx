import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = { 
  apiKey : "AIzaSyBxdLR1kbQBSzx8-VD4Rnc7xxCHyMmAVT0" , 
  authDomain : "videocall-daily.firebaseapp.com" , 
  projectId : "videocall-daily" , 
  storageBucket : "videocall-daily.firebasestorage.app" , 
  messagingSenderId : "547221478499" , 
  appId : "1:547221478499:web:93e36251ea70786da9ec56" , 
  measurementId : "G-1EKWJ0NDER" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
