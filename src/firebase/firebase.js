import * as firebase from 'firebase';
import { configDev, configProd } from '../../firebase-config';

const prodConfig = {
  apiKey: configProd.apiKey,
  authDomain: configProd.authDomain,
  databaseURL: configProd.databaseURL,
  projectId: configProd.projectId,
  storageBucket: configProd.storageBucket,
  messagingSenderId: configProd.messagingSenderId,
};

const devConfig = {
  apiKey: configDev.apiKey,
  authDomain: configDev.authDomain,
  databaseURL: configDev.databaseURL,
  projectId: configDev.projectId,
  storageBucket: configDev.storageBucket,
  messagingSenderId: configDev.messagingSenderId,
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
