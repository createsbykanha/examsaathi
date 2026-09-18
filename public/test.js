const currentUser = JSON.parse(localStorage.getItem('examsaathi_currentUser'));
if (!currentUser) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const subject = params.get('subject') || 'science';

const questionBank = {
  science: [
    { q: "UP Board 2023: Which gas is released during photosynthesis?", options: ["Oxygen","Nitrogen","CO2","Hydrogen"], correct: 0 },
    { q: "SI unit of electric current is:", options: ["Volt","Ampere","Ohm","Watt"], correct: 1 },
    { q: "Which organ pumps blood in human body?", options: ["Lungs","Liver","Heart","Kidney"], correct: 2 }
  ],
  maths: [
    { q: "Value of (a+b)² is:", options: ["a²+b²","a²+2ab+b²","a²-b²","2ab"], correct: 1 },
    { q: "Sum of angles in a triangle is:", options: ["90°","180°","270°","360°"], correct: 1 },
    { q: "√144 = ?", options: ["10","11","12","14"], correct: 2 }
  ],
  social: [
    { q: "Who was the first President of India?", options: ["Nehru","Rajendra Prasad","Gandhi","Patel"], correct: 1 },
    { q: "UP Board: French Revolution started in?", options: ["1789","1857","1947","1990"], correct: 0 }
  ],
  english: [
    { q: "Choose the synonym of 'Happy':", options: ["Sad","Joyful","Angry","Tired"], correct: 1 },
    { q: "Past tense of 'Go' is:", options: ["Gone","Goes","Went","Going"], correct: 2 }
  ]
};

const questions = questionBank[subject] || questionBank.science;
let current = 0;
let answers = new Array(questions.length).fill(null);
let timeLeft = 600;

document.getElementById('testSubjectTitle').innerText = subject.charAt(0).toUpperCase() + subject.slice(1) + ' Test';

const timerInterval = setInterval(() => {
  timeLeft--;
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
  if (timeLeft <= 0) { clearInterval(timerInterval); submitTest(); }
}, 1000);

function renderQuestion() {
  const q = questions[current];
  document.getElementById('qCounter').innerText = `Question ${current+1} of ${questions.length}`;
  document.getElementById('progressFill').style.width = `${((current+1)/questions.length)*100}%`;
  document.getElementById('questionText').innerText = q.q;

  const box = document.getElementById('optionsBox');
  box.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option-item' + (answers[current] === i ? ' selected' : '');
    div.innerText = opt;
    div.onclick = () => { answers[current] = i; renderQuestion(); };
    box.appendChild(div);
  });

  document.getElementById('prevBtn').style.visibility = current === 0 ? 'hidden' : 'visible';
  document.getElementById('nextBtn').innerText = current === questions.length - 1 ? 'Submit' : 'Next';
}

function prevQuestion() { if (current > 0) { current--; renderQuestion(); } }

function nextQuestion() {
  if (current < questions.length - 1) { current++; renderQuestion(); }
  else { clearInterval(timerInterval); submitTest(); }
}

function submitTest() {
  let correct = 0;
  questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
  const percent = Math.round((correct / questions.length) * 100);

  let results = JSON.parse(localStorage.getItem('examsaathi_results') || '[]');
  results.push({
    email: currentUser.email,
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    correct, total: questions.length, percent,
    date: new Date().toLocaleDateString('en-IN')
  });
  localStorage.setItem('examsaathi_results', JSON.stringify(results));

  alert(`Test khatam! Score: ${correct}/${questions.length} (${percent}%)`);
  window.location.href = 'results.html';
}

renderQuestion();
