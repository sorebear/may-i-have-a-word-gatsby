import * as firebase from 'firebase';

const prodConfig = {
  apiKey: "AIzaSyDrj7sZyKTneCIj5vlp5uA_6m5uu-vp2H4",
  authDomain: "may-i-had-a-word.firebaseapp.com",
  databaseURL: "https://may-i-had-a-word.firebaseio.com",
  projectId: "may-i-had-a-word",
  storageBucket: "may-i-had-a-word.appspot.com",
  messagingSenderId: "205632515292"
};

const devConfig = {
  apiKey: "AIzaSyDrj7sZyKTneCIj5vlp5uA_6m5uu-vp2H4",
  authDomain: "may-i-had-a-word.firebaseapp.com",
  databaseURL: "https://may-i-had-a-word.firebaseio.com",
  projectId: "may-i-had-a-word",
  storageBucket: "may-i-had-a-word.appspot.com",
  messagingSenderId: "205632515292"
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
