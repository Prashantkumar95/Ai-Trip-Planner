// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // // Your web app's Firebase configuration
// // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // const firebaseConfig = {
// //    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
// //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
// //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// //   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getFirestore} from 'firebase/firestore'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     // apiKey: "AIzaSyA722sQzsytnMNhhVejoWe8ByFdG89-9nA",
//     // authDomain: "ai-trip-planner-800bc.firebaseapp.com",
//     // projectId: "ai-trip-planner-800bc",
//     // storageBucket: "ai-trip-planner-800bc.firebasestorage.app",
//     // messagingSenderId: "430870426783",
//     // appId: "1:430870426783:web:676654393c22160894deaa",
//     // measurementId: "G-J569J29JBT"

    
//   apiKey: "AIzaSyCQtnsLsFOQiecoV2hWXfFGbwy7pVY9fio",
//   authDomain: "ai-tripplanner-453114.firebaseapp.com",
//   projectId: "ai-tripplanner-453114",
//   storageBucket: "ai-tripplanner-453114.firebasestorage.app",
//   messagingSenderId: "612802160364",
//   appId: "1:612802160364:web:2f954ef0bc5d1ab1ada7c9",
//   measurementId: "G-T7PJ90LBD0"
// };
  

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// // const analytics = getAnalytics(app);



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ added

const firebaseConfig = {
  apiKey: "AIzaSyC5hvrHG779kXZMkx6KbA9i3k9OfadFWG0",
  authDomain: "aitripplanner-dbe4a.firebaseapp.com",
  projectId: "aitripplanner-dbe4a",
  storageBucket: "aitripplanner-dbe4a.firebasestorage.app",
  messagingSenderId: "175722523919",
  appId: "1:175722523919:web:6e767c824ffb5ab0e5227a",
  measurementId: "G-91M0LGX9WS"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ added
