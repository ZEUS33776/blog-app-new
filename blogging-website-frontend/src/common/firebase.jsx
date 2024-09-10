
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"




const firebaseConfig = {
  apiKey: "AIzaSyB3xvLMgSBERcQuoD7fN1ztGwW2onAx4kA",
  authDomain: "react-blogging-website-719b8.firebaseapp.com",
  projectId: "react-blogging-website-719b8",
  storageBucket: "react-blogging-website-719b8.appspot.com",
  messagingSenderId: "766402345498",
  appId: "1:766402345498:web:e85f5ef88c7e271626efa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;
    await signInWithPopup(auth, provider).then((result) => {
        user = result.user
        
    })
        .catch((err) => {
            console.log(err)
        
    })
    return user;
    
}
