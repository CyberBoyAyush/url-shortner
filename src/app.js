const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// In-memory URL storage
const urlStore = new Map();

// Generate 6-character short code
function generateShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

// POST /shorten - Create short URL
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  // Check if URL already exists
  for (const [code, originalUrl] of urlStore.entries()) {
    if (originalUrl === url) {
      return res.status(201).json({ code, originalUrl: url });
    }
  }
  
  // Generate new short code
  const code = generateShortCode();
  urlStore.set(code, url);
  
  res.status(201).json({ code, originalUrl: url });
});

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
