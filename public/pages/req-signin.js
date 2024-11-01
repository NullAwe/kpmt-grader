import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in.
  } else {
    window.location.href = "/pages/login.html";
  }
});
