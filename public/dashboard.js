const currentUser = JSON.parse(localStorage.getItem('examsaathi_currentUser'));
if (!currentUser) window.location.href = 'index.html';

document.getElementById('userName').innerText = currentUser.name;

const subjects = [
  { id: 'science', name: 'Science', icon: '🔬', count: '3 PYQs' },
  { id: 'maths', name: 'Maths', icon: '📐', count: '3 PYQs' },
  { id: 'social', name: 'Social Science', icon: '🌍', count: '2 PYQs' },
  { id: 'english', name: 'English', icon: '📖', count: '2 PYQs' }
];

const grid = document.getElementById('subjectGrid');
subjects.forEach(s => {
  const card = document.createElement('div');
  card.className = 'subject-card';
  card.innerHTML = `<div class="icon">${s.icon}</div><div class="name">${s.name}</div><div class="count">${s.count}</div>`;
  card.onclick = () => window.location.href = `test.html?subject=${s.id}`;
  grid.appendChild(card);
});

const results = JSON.parse(localStorage.getItem('examsaathi_results') || '[]')
  .filter(r => r.email === currentUser.email);

document.getElementById('totalTests').innerText = results.length;
if (results.length > 0) {
  const avg = Math.round(results.reduce((a,b) => a + b.percent, 0) / results.length);
  document.getElementById('avgScore').innerText = avg + '%';
}

if (results.length > 0) {
  const recentBox = document.getElementById('recentResults');
  recentBox.innerHTML = '';
  results.slice(-3).reverse().forEach(r => {
    const color = r.percent >= 50 ? '#4ade80' : '#f87171';
    recentBox.innerHTML += `<div class="result-item">
      <div><p class="subj">${r.subject}</p><p class="date">${r.date}</p></div>
      <p class="result-score" style="color:${color}">${r.percent}%</p>
    </div>`;
  });
}
