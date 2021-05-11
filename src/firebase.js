import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyCCtwB37BS9o0QHNbjuR3mT6FJh4g59xS4",
        authDomain: "instagram-clone-d4e15.firebaseapp.com",
        databaseURL: "https://instagram-clone-d4e15.firebaseio.com",
        projectId: "instagram-clone-d4e15",
        storageBucket: "instagram-clone-d4e15.appspot.com",
        messagingSenderId: "834670917747",
        appId: "1:834670917747:web:5b54880d36f01a2ea81206"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage}; 