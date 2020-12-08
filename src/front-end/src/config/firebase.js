import firebase from 'firebase'
require('firebase/auth')

const firebaseConfig = {
    apiKey: "AIzaSyAh_2Ac_Dn3NDoqUkrSApaDd5hZixJ6dKE",
    authDomain: "direct-exchange.firebaseapp.com",
    databaseURL: "https://direct-exchange.firebaseio.com",
    projectId: "direct-exchange",
    storageBucket: "direct-exchange.appspot.com",
    messagingSenderId: "551976198923",
    appId: "1:551976198923:web:623ffd4267dd954c85f80e"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const firebaseAuth = firebase.auth;

