const params = new URLSearchParams(window.location.search);
const topicId = params.get('id');
const scanned = JSON.parse(localStorage.getItem('examsaathi_scanned') || '[]');
const topic = scanned.find(t => t.id === topicId);

if (!topic) { alert('Topic nahi mila'); window.location.href = 'scan.html'; }

let lang = localStorage.getItem('examsaathi_lang') || 'en';
let current = 0;
let answers = new Array(topic.questions.length).fill(null);

document.getElementById('testTitle').innerText = topic.topic;
document.getElementById('langBtn').innerText = lang.toUpperCase();

function toggleLang() {
  lang = lang === 'en' ? 'hi' : 'en';
  localStorage.setItem('examsaathi_lang', lang);
  document.getElementById('langBtn').innerText = lang.toUpperCase();
  render();
}

function render() {
  const q = topic.questions[current];
  document.getElementById('qCounter').innerText = `Question ${current+1} of ${topic.questions.length}`;
  document.getElementById('progressFill').style.width = `${((current+1)/topic.questions.length)*100}%`;
  document.getElementById('questionText').innerText = lang === 'hi' ? q.hi : q.en;

  const opts = lang === 'hi' ? q.options_hi : q.options_en;
  const box = document.getElementById('optionsBox');
  box.innerHTML = '';
  opts.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option-item' + (answers[current] === i ? ' selected' : '');
    div.innerText = opt;
    div.onclick = () => { answers[current] = i; render(); };
    box.appendChild(div);
  });

  document.getElementById('nextBtn').innerText = current === topic.questions.length - 1 ? 'Submit' : 'Next';
}

function prevQ() { if (current > 0) { current--; render(); } }
function nextQ() {
  if (current < topic.questions.length - 1) { current++; render(); }
  else {
    let correct = 0;
    topic.questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    alert(`Score: ${correct}/${topic.questions.length}`);
    window.location.href = 'dashboard.html';
  }
}

render();

