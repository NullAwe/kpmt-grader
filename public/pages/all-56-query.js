import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { doc, deleteDoc, updateDoc, getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function getGrades() {
  const queryConstraints = []
  const q = query(collection(db, "participants56"), ...queryConstraints);
  const querySnapshot = await getDocs(q);
  const all = []
  querySnapshot.forEach((doc) => {
    all.push([doc.data().indivScore + doc.data().blockScore, doc.data().name, doc.data().teamID, doc.data().school]);
  });
  all.sort(sortFunction);
  var scores_56 = document.getElementById("scores_56");
  scores_56.innerHTML = "";
  var cont = 0;
  for (const score of all) {
    if (score[0] < 0) {
      continue;
    }
    var newRow = scores_56.insertRow();
    var newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[1]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[3]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[2]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[0]));
    const newButton = document.createElement('button');
    newButton.textContent = 'Edit';
    newButton.className = 'btn btn-default btn-block';
    const xx = cont;
    newButton.onclick = function () { edit(xx); };
    cont++;
    newCell = newRow.insertCell();
    newCell.appendChild(newButton);
  }
}

function sortFunction(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? 1 : -1;
  }
}

function edit(x) {
  const tbl = document.getElementById("scores_56");
  const row = tbl.children[x];
  document.getElementById("studentName").innerHTML = row.children[0].innerHTML;
  document.getElementById("teamID").innerHTML = row.children[2].innerHTML;
  $('#modal_form')[0].reset();
  $('#myModal').modal('show');
}

async function updateStudent() {
  const name = document.getElementById("studentName").innerHTML;
  const team = document.getElementById("teamID").innerHTML;
  
  if (confirm("Update info as inputted?")) {
    const queryConstraints = [];
    queryConstraints.push(where("name", "==", name));
    queryConstraints.push(where("teamID", "==", Number(team)));
    const q = query(collection(db, "participants56"), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const all = []
    querySnapshot.forEach((doc) => {
      all.push([doc.id, doc.data().name, doc.data().teamID, doc.data().indivScore, doc.data().blockScore, doc.data().school]);
    });
    for (const did of all) {
      const iscore = document.getElementById("i_score_id").value;
      const bscore = document.getElementById("b_score_id").value;
      if (iscore.length > 0) did[3] = Number(iscore);
      if (bscore.length > 0) did[4] = Number(bscore);
      await updateDoc(doc(db, "participants56", did[0]), {
        name: did[1],
        school: did[5],
        teamID: did[2],
        indivScore: did[3],
        blockScore: did[4]
      });
    }
    $('#myModal').modal('hide');
    getGrades();
  }
}

window.getGrades = getGrades
window.updateStudent = updateStudent