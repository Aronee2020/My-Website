// Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAOAcJE1jc5_d_Fyph1X0nJSYWigS9plQY",

  authDomain: "aronee-hb-booking-system.firebaseapp.com",

  projectId: "aronee-hb-booking-system",

  storageBucket: "aronee-hb-booking-system.firebasestorage.app",

  messagingSenderId: "393085707079",

  appId: "1:393085707079:web:4b2dde638de0d5b5bba262"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);