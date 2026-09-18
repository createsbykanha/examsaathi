const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ExamSaathi server running at http://localhost:${PORT}`);
});
