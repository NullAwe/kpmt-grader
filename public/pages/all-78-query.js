import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { doc, deleteDoc, updateDoc, getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function getGrades78() {
  const queryConstraints = []
  const q = query(collection(db, "participants78"), ...queryConstraints);
  const querySnapshot = await getDocs(q);
  const all = []
  querySnapshot.forEach((doc) => {
    all.push([doc.data().indivScore + doc.data().blockScore, doc.data().name, doc.data().teamID, doc.data().school]);
  });
  all.sort(sortFunction);
  var scores_78 = document.getElementById("scores_78");
  scores_78.innerHTML = "";
  var cont = 0;
  for (const score of all) {
    if (score[0] < 0) {
      continue;
    }
    var newRow = scores_78.insertRow();
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
    newButton.onclick = function () { edit78(xx); };
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

function edit78(x) {
  const tbl = document.getElementById("scores_78");
  const row = tbl.children[x];
  document.getElementById("studentName2").innerHTML = row.children[0].innerHTML;
  document.getElementById("teamID2").innerHTML = row.children[2].innerHTML;
  $('#modal_form2')[0].reset();
  $('#myModal2').modal('show');
}

async function updateStudent78() {
  const name = document.getElementById("studentName2").innerHTML;
  const team = document.getElementById("teamID2").innerHTML;
  
  if (confirm("Update info as inputted?")) {
    const queryConstraints = [];
    queryConstraints.push(where("name", "==", name));
    queryConstraints.push(where("teamID", "==", Number(team)));
    const q = query(collection(db, "participants78"), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const all = []
    querySnapshot.forEach((doc) => {
      all.push([doc.id, doc.data().name, doc.data().teamID, doc.data().indivScore, doc.data().blockScore, doc.data().school]);
    });
    for (const did of all) {
      const iscore = document.getElementById("i_score_id2").value;
      const bscore = document.getElementById("b_score_id2").value;
      if (iscore.length > 0) did[3] = Number(iscore);
      if (bscore.length > 0) did[4] = Number(bscore);
      await updateDoc(doc(db, "participants78", did[0]), {
        name: did[1],
        school: did[5],
        teamID: did[2],
        indivScore: did[3],
        blockScore: did[4]
      });
    }
    $('#myModal2').modal('hide');
    getGrades78();
  }
}

window.getGrades78 = getGrades78
window.updateStudent78 = updateStudent78