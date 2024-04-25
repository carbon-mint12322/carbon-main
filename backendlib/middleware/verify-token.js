var admin = require('firebase-admin');
const NodeRSA = require('node-rsa');
const jwt = require('jsonwebtoken');

let initialized_ = false;

export const getFirebaseCredentials = () => {
  return {
    type: 'service_account',
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    private_key_id: process.env.NEXT_PRIV_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.NEXT_PRIV_FIREBASE_PRIVATE_KEY
      ? process.env.NEXT_PRIV_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n')
      : undefined,
    client_email: process.env.NEXT_PRIV_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.NEXT_PRIV_FIREBASE_CLIENT_ID,
    auth_uri: process.env.NEXT_PRIV_FIREBASE_AUTH_URI,
    token_uri: process.env.NEXT_PRIV_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.NEXT_PRIV_FIREBASE_AUTH_PROV_CERT_URL,
    client_x509_cert_url: process.env.NEXT_PRIV_FIREBASE_X509_URL,
  };
};

// Init auth library if not already initialized;
export const getFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(getFirebaseCredentials()),
    });
  }
  return admin;
  // if (! initialized_) {
  //   admin.initializeApp({
  //     credential: admin.credential.cert(serviceAccount)
  //   });
  //   initialized_ = true;
  // }
  // return admin;
};

export async function verifyIdToken(token) {
  try {
    const firebaseAdmin = getFirebaseAdmin(); // initializes if not already initialized
    const decodedValue = await firebaseAdmin.auth().verifyIdToken(token);
    if (decodedValue) {
      /***
       * Token has this structure:
       * {
       *    iss: 'https://securetoken.google.com/carbon-mint-app',
       *    aud: 'carbon-mint-app',
       *    auth_time: 1654604006,
       *    user_id: 'kIt9gfL6eEg2AFYAnAYmwX5OIgf2',
       *    sub: 'kIt9gfL6eEg2AFYAnAYmwX5OIgf2',
       *    iat: 1654604069,
       *    exp: 1654607669,
       *    phone_number: '+919999999999',
       *    firebase: { identities: { phone: [Array] }, sign_in_provider: 'phone' },
       *    uid: 'kIt9gfL6eEg2AFYAnAYmwX5OIgf2'
       * )}
       *
       */
      return decodedValue;
    }
  } catch (error) {
    console.error(error);
    console.log('token: ', token);
    throw error;
  }
  return undefined;
}

async function verifyToken(token) {
  try {
    // const firebaseAdmin = getFirebaseAdmin(); // initializes if not already initialized
    // const decodedValue = await firebaseAdmin.auth().verifyIdToken(token);
    const publicKey = new NodeRSA()
      .importKey(process.env.NEXT_PRIV_FIREBASE_PRIVATE_KEY, 'pkcs8-private-pem')
      .exportKey('pkcs8-public-pem');

    try {
      let decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });

      return Promise.resolve(decoded);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  } catch (error) {
    console.error(error);
    console.log('token: ', token);
    throw error;
  }
}

export default verifyToken;
