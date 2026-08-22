const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// إرسال ملف index.html عند فتح الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});