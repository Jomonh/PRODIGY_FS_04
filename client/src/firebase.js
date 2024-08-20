// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const apiKey=import.meta.env.API_KEY
const msgSenderId=import.meta.env.MSG_SENDER_ID
const AppId=import.meta.env.APP_ID
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "chat-app-image.firebaseapp.com",
  projectId: "chat-app-image",
  storageBucket: "chat-app-image.appspot.com",
  messagingSenderId: msgSenderId,
  appId: AppId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;