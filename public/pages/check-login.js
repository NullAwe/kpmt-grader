import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();


onAuthStateChanged(auth, user => {
  if (user && user.uid == "6QQFUVK8HNQtoJ7gmKnIQ8RSPoz2") {
    // User is signed in.
    window.location.href = "/pages/index.html";
  } else if (user) {
    window.location.href = "/pages/dashboard.html";
  }
});
