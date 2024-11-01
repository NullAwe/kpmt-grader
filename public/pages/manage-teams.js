import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { doc, deleteDoc, updateDoc, getFirestore, collection, query, where, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  // REDACTED
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Track:
// Team ID
// School ID
// Test scores
// School Name (just for display)
// Team Members (just for display)
async function createTeamInternal(tableName, newTeamId, school, students) {
  await setDoc(doc(db, tableName, newTeamId), {
    teamID: Number(newTeamId),
    mentalScore: 0,
    algNtScore: 0,
    geoScore: 0,
    comboScore: 0,
    schoolName: school,
    teamMembers: students
  });
  return true;
}

async function createStudentInternal(name, school, team) {
  const tableName = "participants" + (team.toString().charAt(0) == "1" ? "56" : "78");
  await setDoc(doc(db, tableName, name), {
    name: name,
    school: school,
    teamID: Number(team),
    indivScore: 0,
    blockScore: 0
  });
}

// Team ID format = grade (1 for 56, 2 for 78) + schoolID (padded to 2 digits) + team number (padded to 2 digits):
async function createTeam(school, name1, name2, name3, name4, grade) {
  const findSchoolConstraints = [where("school", "==", school)];
  const findSchoolQ = query(collection(db, "schools"), ...findSchoolConstraints);
  const findSchoolSnap = await getDocs(findSchoolQ);
  if (findSchoolSnap.empty) {
    alert("School not found. Make sure full name is entered and spelled correctly.");
    return false;
  }
  var schoolId = findSchoolSnap.docs[0].data().id;
  const students = [];
  if (name1.length > 0) students.push(name1);
  if (name2.length > 0) students.push(name2);
  if (name3.length > 0) students.push(name3);
  if (name4.length > 0) students.push(name4);
  if (students.length == 0) {
    alert("Please enter at least one student.");
    return false;
  }
  if (grade == 0) {
    alert("Please select a grade.");
    return false;
  }
  const tableName = "teams" + (grade == 1 ? "56" : "78");
  const countExistConstraints = [where("schoolName", "==", school)];
  const countExistQ = query(collection(db, tableName), ...countExistConstraints);
  const countExistSnap = await getDocs(countExistQ);
  var newTeamNum = (countExistSnap.size + 1).toString();
  if (newTeamNum.length == 1) {
    newTeamNum = "0" + newTeamNum;
  }
  var schoolIdStr = schoolId.toString();
  if (schoolIdStr.length == 1) {
    schoolIdStr = "0" + schoolIdStr;
  }
  var newTeamId = grade.toString() + schoolIdStr + newTeamNum;
  for (const student of students) {
    createStudentInternal(student, school, newTeamId);
  }
  return createTeamInternal(tableName, newTeamId, school, students);
}

async function create() {
  const school = document.getElementById("schoolName").value;
  const name1 = document.getElementById("createName1").value;
  const name2 = document.getElementById("createName2").value;
  const name3 = document.getElementById("createName3").value;
  const name4 = document.getElementById("createName4").value;
  var grade = 0;
  if (document.getElementById("56").checked) {
    grade = 1;
  } else if (document.getElementById("78").checked) {
    grade = 2;
  }
  if (await createTeam(school, name1, name2, name3, name4, grade)) {
    $('#createTeamModal').modal('hide');
    getTeams56();
    getTeams78();
  }
}

function openAddTeam() {
  $('#createTeamModalForm')[0].reset();
  $('#createTeamModal').modal('show');
}

function sortFunction(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? 1 : -1;
  }
}

async function getTeams56() {
  const teamQueryConstraints = []
  const q = query(collection(db, "teams56"), ...teamQueryConstraints);
  const querySnapshot = await getDocs(q);
  const all = []
  querySnapshot.forEach((doc) => {
    all.push([doc.data().mentalScore + doc.data().algNtScore + doc.data().comboScore + doc.data().geoScore, doc.data().teamID, doc.data().schoolName, doc.data().teamMembers]);
  });
  all.sort(sortFunction);
  var scores56 = document.getElementById("teamScores56");
  scores56.innerHTML = "";
  var cont = 0;
  for (const score of all) {
    if (score[0] < 0) {
      continue;
    }
    var newRow = scores56.insertRow();
    var newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[1]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[2]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[3].join(", ")));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[0]));
    const newButton = document.createElement('button');
    newButton.textContent = 'Edit';
    newButton.className = 'btn btn-default btn-block';
    const xx = cont;
    newButton.onclick = function() { edit56(xx); };
    newCell = newRow.insertCell();
    newCell.appendChild(newButton);
    cont++;
  }
}

async function getTeams78() {
  const teamQueryConstraints = []
  const q = query(collection(db, "teams78"), ...teamQueryConstraints);
  const querySnapshot = await getDocs(q);
  const all = []
  querySnapshot.forEach((doc) => {
    all.push([doc.data().mentalScore + doc.data().algNtScore + doc.data().comboScore + doc.data().geoScore, doc.data().teamID, doc.data().schoolName, doc.data().teamMembers]);
  });
  all.sort(sortFunction);
  var scores78 = document.getElementById("teamScores78");
  scores78.innerHTML = "";
  var cont = 0;
  for (const score of all) {
    if (score[0] < 0) {
      continue;
    }
    var newRow = scores78.insertRow();
    var newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[1]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[2]));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[3].join(", ")));
    newCell = newRow.insertCell();
    newCell.appendChild(document.createTextNode(score[0]));
    const newButton = document.createElement('button');
    newButton.textContent = 'Edit';
    newButton.className = 'btn btn-default btn-block';
    const xx = cont;
    newButton.onclick = function() { edit78(xx); };
    newCell = newRow.insertCell();
    newCell.appendChild(newButton);
    cont++;
  }  
}

function edit56(x) {
  const tbl = document.getElementById("teamScores56");
  const row = tbl.children[x];
  document.getElementById("teamId56").innerHTML = row.children[0].innerHTML;
  document.getElementById("schoolName56").innerHTML = row.children[1].innerHTML;
  $('#modalForm56')[0].reset();
  $('#teamModal56').modal('show');
}

function edit78(x) {
  const tbl = document.getElementById("teamScores78");
  const row = tbl.children[x];
  document.getElementById("teamId78").innerHTML = row.children[0].innerHTML;
  document.getElementById("schoolName78").innerHTML = row.children[1].innerHTML;
  $('#modalForm78')[0].reset();
  $('#teamModal78').modal('show');
}

async function removeStudentInternal(name, team) {
  const queryConstraints = [];
  queryConstraints.push(where("name", "==", name));
  queryConstraints.push(where("teamID", "==", Number(team)));
  const tableName = "participants" + (team.toString().charAt(0) == "1" ? "56" : "78");
  const q = query(collection(db, tableName), ...queryConstraints);
  const querySnapshot = await getDocs(q);
  const all = [];
  querySnapshot.forEach((doc) => {
    all.push(doc.id);
  });
  for (const did of all) {
    await deleteDoc(doc(db, tableName, did));
  }
}

async function removeTeamInternal(tableName, team) {
  const queryConstraints = [where("teamID", "==", Number(team))];
  const q = query(collection(db, tableName), ...queryConstraints);
  const querySnapshot = await getDocs(q);
  const all = [];
  const allTeam = [];
  querySnapshot.forEach((doc) => {
    all.push(doc.id);
    allTeam.push(doc.data().teamMembers);
  });
  for (var i = 0; i < all.length; i++) {
    await deleteDoc(doc(db, tableName, all[i]));
    for (const name of allTeam[i]) {
      await removeStudentInternal(name, team);
    }
  }
}

async function removeTeam56() {
  const team = document.getElementById("teamId56").innerHTML;
  if (confirm("Are you sure you want to remove team " + team + "?")) {
    removeTeamInternal("teams56", team);
    $('#teamModal56').modal('hide');
    getTeams56();
  }
}

async function removeTeam78() {
  const team = document.getElementById("teamId78").innerHTML;
  if (confirm("Are you sure you want to remove team " + team + "?")) {
    removeTeamInternal("teams78", team);
    $('#teamModal78').modal('hide');
    getTeams78();
  }
}

async function updateTeam56() {
  const team = document.getElementById("teamId56").innerHTML;
  if (confirm("Update info as inputted?")) {
    const queryConstraints = [where("teamID", "==", Number(team))];
    const q = query(collection(db, "teams56"), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const all = [];
    var members = [];
    querySnapshot.forEach((doc) => {
      all.push(doc.id);
      for (const member of doc.data().teamMembers) {
        members.push(member);
      }
    });
    const name1 = document.getElementById("name1_56").value;
    const name2 = document.getElementById("name2_56").value;
    const name3 = document.getElementById("name3_56").value;
    const name4 = document.getElementById("name4_56").value;
    const students = [];
    if (name1.length > 0) students.push(name1);
    if (name2.length > 0) students.push(name2);
    if (name3.length > 0) students.push(name3);
    if (name4.length > 0) students.push(name4);
    const school = document.getElementById("schoolName56").innerHTML;
    if (students.length > 0) {
      await removeTeamInternal("teams56", team);
      createTeamInternal("teams56", team, school, students);
      for (const student of students) {
        createStudentInternal(student, school, team);
      }
      members = students;
    }
    var mentalScore = 0;
    var algNtScore = 0;
    var comboScore = 0;
    var geoScore = 0;
    querySnapshot.forEach((doc) => {
      mentalScore = doc.data().mentalScore;
      algNtScore = doc.data().algNtScore;
      comboScore = doc.data().comboScore;
      geoScore = doc.data().geoScore;
    });
    if (document.getElementById("mentalScore56").value.length > 0) {
      mentalScore = Number(document.getElementById("mentalScore56").value);
    }
    if (document.getElementById("algNtScore56").value.length > 0) {
      algNtScore = Number(document.getElementById("algNtScore56").value);
    }
    if (document.getElementById("comboScore56").value.length > 0) {
      comboScore = Number(document.getElementById("comboScore56").value);
    }
    if (document.getElementById("geoScore56").value.length > 0) {
      geoScore = Number(document.getElementById("geoScore56").value);
    }
    setDoc(doc(db, "teams56", team), {
      mentalScore: mentalScore,
      algNtScore: algNtScore,
      comboScore: comboScore,
      geoScore: geoScore,
      schoolName: school,
      teamID: Number(team),
      teamMembers: members
    });
    $('#teamModal56').modal('hide');
    getTeams56();
  }
}

async function updateTeam78() {
  const team = document.getElementById("teamId78").innerHTML;
  if (confirm("Update info as inputted?")) {
    const queryConstraints = [where("teamID", "==", Number(team))];
    const q = query(collection(db, "teams78"), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const all = [];
    var members = [];
    querySnapshot.forEach((doc) => {
      all.push(doc.id);
      for (const member of doc.data().teamMembers) {
        members.push(member);
      }
    });
    const name1 = document.getElementById("name1_78").value;
    const name2 = document.getElementById("name2_78").value;
    const name3 = document.getElementById("name3_78").value;
    const name4 = document.getElementById("name4_78").value;
    const students = [];
    if (name1.length > 0) students.push(name1);
    if (name2.length > 0) students.push(name2);
    if (name3.length > 0) students.push(name3);
    if (name4.length > 0) students.push(name4);
    const school = document.getElementById("schoolName78").innerHTML;
    if (students.length > 0) {
      await removeTeamInternal("teams78", team);
      createTeamInternal("teams78", team, school, students);
      for (const student of students) {
        createStudentInternal(student, school, team);
      }
      members = students;
    }
    var mentalScore = 0;
    var algNtScore = 0;
    var comboScore = 0;
    var geoScore = 0;
    querySnapshot.forEach((doc) => {
      mentalScore = doc.data().mentalScore;
      algNtScore = doc.data().algNtScore;
      comboScore = doc.data().comboScore;
      geoScore = doc.data().geoScore;
    });
    if (document.getElementById("mentalScore78").value.length > 0) {
      mentalScore = Number(document.getElementById("mentalScore78").value);
    }
    if (document.getElementById("algNtScore78").value.length > 0) {
      algNtScore = Number(document.getElementById("algNtScore78").value);
      console.log("updating 1");
    }
    if (document.getElementById("comboScore78").value.length > 0) {
      comboScore = Number(document.getElementById("comboScore78").value);
      console.log("updating 2");
    }
    if (document.getElementById("geoScore78").value.length > 0) {
      geoScore = Number(document.getElementById("geoScore78").value);
      console.log("updating 3");
    }
    setDoc(doc(db, "teams78", team), {
      mentalScore: mentalScore,
      algNtScore: algNtScore,
      comboScore: comboScore,
      geoScore: geoScore,
      schoolName: school,
      teamID: Number(team),
      teamMembers: members
    });
    $('#teamModal78').modal('hide');
    getTeams78();
  }
}

window.getTeams56 = getTeams56
window.getTeams78 = getTeams78
window.createTeam = create
window.openAddTeam = openAddTeam
window.removeTeam56 = removeTeam56
window.removeTeam78 = removeTeam78
window.updateTeam56 = updateTeam56
window.updateTeam78 = updateTeam78