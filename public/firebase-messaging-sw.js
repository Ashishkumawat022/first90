// import firebase from "./../src/firebase"
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyC4otJzHozirr8GhEGjDwVbV3Imx0OAmJI",
    authDomain: "first90-47f17.firebaseapp.com",
    projectId: "first90-47f17",
    storageBucket: "first90-47f17.appspot.com",
    messagingSenderId: "514496885083",
    appId: "1:514496885083:web:fa518fa8e77355f632aa7e",
    
})

const initMessaging = firebase.messaging()

initMessaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
  
    window.self.registration.showNotification(notificationTitle,
      notificationOptions);
  });