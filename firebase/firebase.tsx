import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { getDatabase, ref as firebaseDatabaseRef, set as firebaseDatabaseSet, child, get, onValue } from 'firebase/database'
//ref tham chieu den collection




const firebaseConfig = {
    apiKey: "AIzaSyD_FBGrVucON1rgqZzksrOLnGVNx-d7u4Y",
    authDomain: "chatappproject-85b8b.firebaseapp.com",
    databaseURL: "https://chatappproject-85b8b-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "chatappproject-85b8b",
    storageBucket: "chatappproject-85b8b.appspot.com",
    appId: "1:495400426864:android:d59f663161b679301603b5",
    messagingSenderId: "495400426864",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firebaseDatabase = getDatabase()

export {
    auth,
    firebaseDatabase,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    firebaseDatabaseRef,
    firebaseDatabaseSet,
    sendEmailVerification,
    child,
    get,
    onValue,                    // Để theo dõi thay đổi
}