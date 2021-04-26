import React, { useState } from "react";
import "./App.css";
import firebase from "firebase";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: ""
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    console.log("Clicked signin");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log(result);
        const { displayName, email } = result.user;

        const singedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email
        };
        setUser(singedInUser);
        console.log(displayName, email);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const handleSignOut = () => {
    console.log("User Signed Out");
    firebase
      .auth()
      .signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: ""
        };
        setUser(signedOutUser);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSignedIn && (
        <div>
          <p>Welcome : {user.name}</p>
          <p>Email:{user.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
