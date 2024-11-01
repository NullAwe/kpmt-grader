import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { doc, updateDoc, getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
var user_id = "";
onAuthStateChanged(auth, user => {
  if (user) {
    user_id = user.uid;
  }
});


const db = getFirestore(app);

async function getStudents() {
  const queryConstraints = [];
  queryConstraints.push(where("parent", "==", user_id));
  const q = query(collection(db, "teams"), ...queryConstraints);
  const querySnapshot = await getDocs(q);
  const all = [];
  querySnapshot.forEach((doc) => {
    all.push(doc.id);
  });
  const all2 = []
  for (const tid of all) {
    const queryConstraints2 = [];
    queryConstraints2.push(where("teamID", "==", Number(tid)));
    const q2 = query(collection(db, "participants56"), ...queryConstraints2);
    const snapshot2 = await getDocs(q2);
    snapshot2.forEach((doc) => {
      all2.push([doc.data().teamID, doc.data().name, doc.data().school]);
    });
  }
  all2.sort(sortFunction);
  var teams_56 = document.getElementById("teams_56");
  teams_56.innerHTML = "";
  for (const score of all2) {
    var newRow = teams_56.insertRow();
    var newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[1]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[2]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[0]));
  }
}

function sortFunction(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}

window.getStudents = getStudents