// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBHwYikYT97-Y-mNxOg7OFYDZ0Dh3CLxk",
  authDomain: "travel-a55ee.firebaseapp.com",
  projectId: "travel-a55ee",
  storageBucket: "travel-a55ee.appspot.com",
  messagingSenderId: "341630371599",
  appId: "1:341630371599:web:b9eff5f034ff243dd2207a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
