import Firebase from 'firebase';
let config = {
  apiKey: 'AIzaSyBRwGJj49W0_v4mZhDxErkUQDoVeWngGH4',
  authDomain: 'reshare-7a0b0.firebaseapp.com',
  databaseURL: 'https://reshare-7a0b0.firebaseio.com',
  projectId: 'reshare-7a0b0',
  storageBucket: 'reshare-7a0b0.appspot.com',
  messagingSenderId: '39458655800'
};
let app = Firebase.initializeApp(config);
export const db = app.database();