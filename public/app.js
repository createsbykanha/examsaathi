function switchTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (tab === 'login') {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// SIGNUP
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const phone = document.getElementById('signupPhone').value;
  const cls = document.getElementById('signupClass').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  let users = JSON.parse(localStorage.getItem('examsaathi_users') || '[]');

  if (users.find(u => u.email === email)) {
    document.getElementById('signupMsg').innerText = "Ye email pehle se registered hai!";
    document.getElementById('signupMsg').style.color = "#f87171";
    return;
  }

  users.push({ name, phone, class: cls, email, password });
  localStorage.setItem('examsaathi_users', JSON.stringify(users));
  localStorage.setItem('examsaathi_currentUser', JSON.stringify({ name, class: cls, email }));

  document.getElementById('signupMsg').innerText = "Account ban gaya! Redirecting...";
  document.getElementById('signupMsg').style.color = "#4ade80";

  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
});

// LOGIN
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  let users = JSON.parse(localStorage.getItem('examsaathi_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('examsaathi_currentUser', JSON.stringify(user));
    document.getElementById('loginMsg').innerText = "Login successful! Redirecting...";
    document.getElementById('loginMsg').style.color = "#4ade80";
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
  } else {
    document.getElementById('loginMsg').innerText = "Email ya password galat hai!";
    document.getElementById('loginMsg').style.color = "#f87171";
  }
});

function googleSignIn() {
  alert("Google Sign-In ke liye Firebase setup chahiye — ye Phase 2 mein add karenge (Firebase account free hai, 2 minute mein ban jata hai).");
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
