import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { doc, updateDoc, getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function inputGrades() {
  if ($('input[type=radio]:checked').size() == 0) {
    alert("Please select a test.");
    return false;
  }
  if (document.getElementById("score_id").value.length == 0) {
    alert("Please enter a score.");
    return false;
  }
  if (document.getElementById('individual').checked || document.getElementById('block').checked) {
    const queryConstraints = []
    queryConstraints.push(where('name', '==', document.getElementById("name_id").value))
    queryConstraints.push(where('teamID', '==', Number(document.getElementById("team_id").value)))
    var tm = document.getElementById("team_id").value;
    var dc = "participants56"
    if (tm.length == 5 && tm.charAt(0) == '2') {
      dc = "participants78"
    }
    const q = query(collection(db, dc), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("No results found. Check name and team ID again.");
      return false;
    }
    const ids = []
    querySnapshot.forEach((doc) => {
      ids.push(doc.id);
    });
    for (const id of ids) {
      const dd = doc(db, dc, id);
      if (document.getElementById('individual').checked) {
        await updateDoc(dd, {
          indivScore : Number(document.getElementById("score_id").value)
        });
      } else if (document.getElementById('block').checked) {
        await updateDoc(dd, {
          blockScore : Number(document.getElementById("score_id").value)
        });
      }
    }
  } else {
    const queryConstraints = []
    queryConstraints.push(where('teamID', '==', Number(document.getElementById("team_id").value)))
    var tm = document.getElementById("team_id").value;
    var dc = "teams56";
    if (tm.length == 5 && tm.charAt(0) == '2') {
      dc = "teams78";
    }
    console.log(dc);
    const q = query(collection(db, dc), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("No results found. Check team ID again.");
      return false;
    }
    const ids = [];
    querySnapshot.forEach((doc) => {
      ids.push(doc.id);
    });
    for (const id of ids) {
      const dd = doc(db, dc, id);
      if (document.getElementById('mentalmath').checked) {
        await updateDoc(dd, {
          mentalScore : Number(document.getElementById("score_id").value)
        });
      } else if (document.getElementById('algebrant').checked) {
        await updateDoc(dd, {
          algNtScore : Number(document.getElementById("score_id").value)
        });
      } else if (document.getElementById('geometry').checked) {
        await updateDoc(dd, {
          geoScore : Number(document.getElementById("score_id").value)
        });
      } else if (document.getElementById('combo').checked) {
        await updateDoc(dd, {
          comboScore : Number(document.getElementById("score_id").value)
        });
      }
    }
  }
  alert("Updated!");
  window.location.href = "/pages/input_grades.html";
  return true;
}

window.inputGrades = inputGrades