import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    // your Firebase credentials go here
    apiKey: "AIzaSyARlwBpYC3jqlxUCAw4T1MgzvtsDvrStBY",
    authDomain: "mern-messenger-3d601.firebaseapp.com",
    databaseURL: "https://mern-messenger-3d601.firebaseio.com",
    projectId: "mern-messenger-3d601",
    storageBucket: "mern-messenger-3d601.appspot.com",
    messagingSenderId: "740497836239",
    appId: "1:740497836239:web:1aa718da578d8d6b820fba"   
})

const db = firebaseApp.firestore()

export default db