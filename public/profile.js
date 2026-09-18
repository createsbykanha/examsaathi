const currentUser = JSON.parse(localStorage.getItem('examsaathi_currentUser'));
if (!currentUser) window.location.href = 'index.html';

document.getElementById('pName').innerText = currentUser.name;
document.getElementById('pEmail').innerText = currentUser.email;
document.getElementById('pClass').innerText = 'Class ' + currentUser.class + 'th';

function logout() {
  localStorage.removeItem('examsaathi_currentUser');
  window.location.href = 'index.html';
}
