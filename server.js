
const express = require('express');
const path = require('path');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/scan-generate', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Ye ek textbook page ki photo hai (UP Board Class 10/12 syllabus).
Is image ke andar jitne bhi topics/concepts dikh rahe hain, unke liye kam se kam 20 exam-level MCQ questions banao (agar numerical/calculation wala topic hai to unme se kuch questions numerical type ke hone chahiye).

Har question Hindi AUR English dono mein do. Sirf neeche diye JSON format mein reply karo, koi extra text mat likho, koi markdown code fence bhi mat lagao:

{
  "topic": "Topic ka naam",
  "questions": [
    {
      "en": "Question in English",
      "hi": "प्रश्न हिंदी में",
      "options_en": ["A","B","C","D"],
      "options_hi": ["अ","ब","स","द"],
      "correct": 0
    }
  ]
}`;

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    let text = result.response.text();
    text = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(text);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scan failed', details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ExamSaathi server running on port ${PORT}`);
});
