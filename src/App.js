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

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    console.log("Clicked signin");
    firebase
      .auth()
      .signInWithPopup(googleProvider)
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
          updateUserName(user.name);
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
        .then(res => {
          // Signed in
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log("sign in user info", res.user);
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

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name
        // photoURL: "https://example.com/jane-q-user/profile.jpg"
      })
      .then(res => {
        // Update successful.
        console.log("User Name updated successfully");
      })
      .catch(err => {
        // An error happened.
        console.log("User Name Error", err.message);
      });
  };

  const handleFbSignIn = () => {
    console.log("fb clicked")
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then(result => {
        // /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential;

        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const accessToken = credential.accessToken;
        console.log("FB USER", user);
        // ...
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
console.log(errorMessage)
        // ...
      });
  };
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      <br />
      <button onClick={handleFbSignIn}>Sign in using Facebook</button>
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
        <input type="submit" value={newUser ? "SignUp" : "SignIn"} />
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
