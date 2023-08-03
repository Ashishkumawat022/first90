import firebase from 'firebase'
import "firebase/messaging";

export const FirebaseConfig = {
    apiKey: "AIzaSyC4otJzHozirr8GhEGjDwVbV3Imx0OAmJI",
  authDomain: "first90-47f17.firebaseapp.com",
  projectId: "first90-47f17",
  databaseURL: 'https://first90-47f17.firebaseio.com',

  storageBucket: "first90-47f17.appspot.com",
  messagingSenderId: "514496885083",
  appId: "1:514496885083:web:fa518fa8e77355f632aa7e",
  measurementId: "G-0CFTSLZCX3"
}

firebase.initializeApp(FirebaseConfig)

export default firebase

export const messaging = firebase.messaging();

export const getToken = (setTokenFound:any) => {
  return messaging.getToken({vapidKey: 'BDUYMH-76LMu8BhVsPDE5f2nzq5fF7yMc4QBU5T61sZCR1wdo1drFM4R2HvV8Xnbk5QJuW_sxGXehsSgdKEFr6M'}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload:any) => {
      console.log("onMessageListener,firebase.ts",payload)
      resolve(payload);
    });
});