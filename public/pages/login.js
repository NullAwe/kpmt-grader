import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

function signIn() {
  signInWithEmailAndPassword(auth, document.getElementById("email_id").value, document.getElementById("password_id").value)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "/pages/index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Login failed, try again...");
    });
}

window.signIn = signIn