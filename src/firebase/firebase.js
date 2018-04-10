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
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
