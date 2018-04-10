import * as firebase from 'firebase';

const prodConfig = {
  API_KEY : 'AIzaSyDrj7sZyKTneCIj5vlp5uA_6m5uu-vp2H4',
  AUTH_DOMAIN : 'may-i-had-a-word.firebaseapp.com',
  DATABASE_URL : 'https://may-i-had-a-word.firebaseio.com',
  PROJECT_ID : 'may-i-had-a-word',
  STORAGE_BUCKET : 'may-i-had-a-word.appspot.com',
  MESSAGING_SENDER_ID : 205632515292,
};

const devConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  console.log('Hello');
  console.log('ENV Variables', process.env);
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
