const currentUser = JSON.parse(localStorage.getItem('examsaathi_currentUser'));
if (!currentUser) window.location.href = 'index.html';

const results = JSON.parse(localStorage.getItem('examsaathi_results') || '[]')
  .filter(r => r.email === currentUser.email).reverse();

const list = document.getElementById('resultsList');

if (results.length === 0) {
  list.innerHTML = '<p class="empty-msg">Abhi tak koi test nahi diya hai</p>';
} else {
  results.forEach(r => {
    const color = r.percent >= 50 ? '#4ade80' : '#f87171';
    list.innerHTML += `<div class="result-item" style="margin-bottom:10px;">
      <div><p class="subj">${r.subject}</p><p class="date">${r.date} • ${r.correct}/${r.total} correct</p></div>
      <p class="result-score" style="color:${color}">${r.percent}%</p>
    </div>`;
  });
}
