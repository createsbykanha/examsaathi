let selectedFile = null;

document.getElementById('photoInput').addEventListener('change', function(e) {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    const url = URL.createObjectURL(selectedFile);
    document.getElementById('previewBox').innerHTML = `<img src="${url}" style="width:100%;border-radius:14px;">`;
    document.getElementById('generateBtn').style.display = 'block';
  }
});

async function generateQuestions() {
  if (!selectedFile) return;

  const statusMsg = document.getElementById('statusMsg');
  statusMsg.innerText = "AI photo scan kar raha hai... (10-20 seconds)";
  statusMsg.style.color = "#60a5fa";
  document.getElementById('generateBtn').disabled = true;

  const formData = new FormData();
  formData.append('photo', selectedFile);

  try {
    const res = await fetch('/api/scan-generate', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.error) {
      statusMsg.innerText = "Error: " + data.error;
      statusMsg.style.color = "#f87171";
      document.getElementById('generateBtn').disabled = false;
      return;
    }

    let scanned = JSON.parse(localStorage.getItem('examsaathi_scanned') || '[]');
    const newTopic = { id: 'scan_' + Date.now(), ...data };
    scanned.push(newTopic);
    localStorage.setItem('examsaathi_scanned', JSON.stringify(scanned));

    statusMsg.innerText = `${data.questions.length} questions ban gaye topic "${data.topic}" ke liye!`;
    statusMsg.style.color = "#4ade80";
    document.getElementById('generateBtn').disabled = false;

    document.getElementById('resultBox').innerHTML = `
      <div class="subject-card" style="margin-top:16px;" onclick="window.location.href='scantest.html?id=${newTopic.id}'">
        <div class="icon">📘</div>
        <div class="name">${data.topic}</div>
        <div class="count">${data.questions.length} Questions — Test Dene ke liye Tap Karo</div>
      </div>`;

  } catch (err) {
    statusMsg.innerText = "Kuch galat ho gaya, dobara try karo";
    statusMsg.style.color = "#f87171";
    document.getElementById('generateBtn').disabled = false;
  }
}
