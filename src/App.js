import React, { useState } from "react";
import "./App.css";
import firebase from "firebase";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
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

  const handleSubmit = e => {
    e.preventDefault();
    console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(userCredential => {
          // Signed in
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          // const user = userCredential.user;
          // console.log(user)
          // ...
        })
        .catch(error => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // console.log(errorCode, errorMessage);
          // ..
        });
      // console.log("submitting")
    }
    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(userCredential => {
          // Signed in
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          // var user = userCredential.user;
          // ...
        })
        .catch(error => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
  };

  const handleBlur = e => {
    // console.log(e.target.name, e.target.value);
    // debugger
    let isFormValid = true;
    if (e.target.name === "email") {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);

      // const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
      // console.log(isEmailValid);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      // console.log(isPasswordValid && passwordHasNumber);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
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
      <h1>Own Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email:{user.email}</p>
      <p>Password:{user.password}</p> */}
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
      />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onBlur={handleBlur}
          />
        )}
        <br />
        <input
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Your email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleBlur}
          placeholder="Your Password"
          required
        />
        <br />
        <input type="submit" value="submit" />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>
          User {newUser ? "Created" : "Logged In"} Successfully
        </p>
      )}
    </div>
  );
}

export default App;
