import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  // REDACTED
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

function logout() {
  const auth = getAuth();
  signOut(auth).then(() => {
    // Sign-out successful.
    return true;
  }).catch((error) => {
    alert("Something went wrong.");
    return false;
  });
}

window.logout = logout