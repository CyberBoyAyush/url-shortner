const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

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

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// GET /:code - Redirect to original URL
app.get('/:code', (req, res) => {
  const { code } = req.params;
  const originalUrl = urlStore.get(code);
  
  if (!originalUrl) {
    return res.status(404).json({ error: 'Short code not found' });
  }
  
  res.redirect(302, originalUrl);
});

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
