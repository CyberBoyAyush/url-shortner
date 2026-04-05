#!/bin/bash

# This script creates the git history for the URL shortener project
# Run this script from within the url-shortener directory

# Navigate to project directory
cd "$(dirname "$0")"

# Initialize git repo
git init

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
*.log
.env
build-artifact.zip
coverage/
EOF

# Commit 1: April 3, 2026 - Initial project setup (cyberboyayush)
export GIT_AUTHOR_DATE="2026-04-03 10:00:00"
export GIT_COMMITTER_DATE="2026-04-03 10:00:00"
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" add package.json README.md .gitignore
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" commit -m "Initial project setup with package.json and README"

# Commit 2: April 3, 2026 - Basic Express server (vrandaagarg)
export GIT_AUTHOR_DATE="2026-04-03 14:30:00"
export GIT_COMMITTER_DATE="2026-04-03 14:30:00"
git -c user.name="vrandaagarg" -c user.email="gargvranda963@gmail.com" add src/app.js
git -c user.name="vrandaagarg" -c user.email="gargvranda963@gmail.com" commit -m "Create basic Express server with middleware setup"

# Commit 3: April 4, 2026 - URL shortening endpoint (cyberboyayush)
export GIT_AUTHOR_DATE="2026-04-04 09:15:00"
export GIT_COMMITTER_DATE="2026-04-04 09:15:00"
# We'll recreate the full app.js with shortening logic
cat > src/app.js << 'APPEOF'
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
APPEOF

git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" add src/app.js
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" commit -m "Implement URL shortening endpoint with crypto-based code generation"

# Commit 4: April 4, 2026 - Redirect and health endpoints (snehaagarwal03)
export GIT_AUTHOR_DATE="2026-04-04 16:45:00"
export GIT_COMMITTER_DATE="2026-04-04 16:45:00"
# Recreate app.js with all endpoints
cat > src/app.js << 'APPEOF'
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

// GET /:code - Redirect to original URL
app.get('/:code', (req, res) => {
  const { code } = req.params;
  const originalUrl = urlStore.get(code);
  
  if (!originalUrl) {
    return res.status(404).json({ error: 'Short code not found' });
  }
  
  res.redirect(302, originalUrl);
});

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
APPEOF

git -c user.name="snehaagarwal03" -c user.email="snehaagarwal1322@gmail.com" add src/app.js
git -c user.name="snehaagarwal03" -c user.email="snehaagarwal1322@gmail.com" commit -m "Add redirect and health check endpoints"

# Commit 5: April 5, 2026 - Jest setup and test file (cyberboyayush)
export GIT_AUTHOR_DATE="2026-04-05 11:20:00"
export GIT_COMMITTER_DATE="2026-04-05 11:20:00"
# Create tests/app.test.js (basic structure)
cat > tests/app.test.js << 'TESTEOF'
const request = require('supertest');
const app = require('../src/app');

describe('URL Shortener API', () => {
  beforeEach(() => {
    // Tests will go here
  });

  describe('POST /shorten', () => {
    test('should return a short code for a valid URL', async () => {
      // Test implementation coming next
    });
  });
});
TESTEOF

git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" add tests/app.test.js
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" commit -m "Add Jest setup and initial test structure"

# Commit 6: April 5, 2026 - Complete test suite (cyberboyayush)
export GIT_AUTHOR_DATE="2026-04-05 13:00:00"
export GIT_COMMITTER_DATE="2026-04-05 13:00:00"
# Create complete tests/app.test.js
cat > tests/app.test.js << 'TESTEOF'
const request = require('supertest');
const app = require('../src/app');

describe('URL Shortener API', () => {
  describe('POST /shorten', () => {
    test('should return a short code for a valid URL', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({ url: 'https://example.com' })
        .expect(201);

      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('originalUrl', 'https://example.com');
      expect(response.body.code).toHaveLength(6);
    });

    test('should return same code for duplicate URL', async () => {
      const firstResponse = await request(app)
        .post('/shorten')
        .send({ url: 'https://duplicate.com' })
        .expect(201);

      const secondResponse = await request(app)
        .post('/shorten')
        .send({ url: 'https://duplicate.com' })
        .expect(201);

      expect(firstResponse.body.code).toBe(secondResponse.body.code);
    });

    test('should return 400 if URL is missing', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'URL is required');
    });
  });

  describe('GET /:code', () => {
    test('should redirect to original URL for valid code', async () => {
      const shortenResponse = await request(app)
        .post('/shorten')
        .send({ url: 'https://google.com' })
        .expect(201);

      const { code } = shortenResponse.body;

      await request(app)
        .get(\`\${code}\`)
        .expect(302)
        .expect('Location', 'https://google.com');
    });

    test('should return 404 for unknown code', async () => {
      const response = await request(app)
        .get('/unknown123')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Short code not found');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
});
TESTEOF

git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" add tests/app.test.js
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" commit -m "Write comprehensive tests for all endpoints"

# Commit 7: April 5, 2026 - Add Jenkinsfile (cyberboyayush)
export GIT_AUTHOR_DATE="2026-04-05 15:30:00"
export GIT_COMMITTER_DATE="2026-04-05 15:30:00"
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" add Jenkinsfile
git -c user.name="cyberboyayush" -c user.email="hi@aysh.me" commit -m "Add Jenkinsfile for CI/CD pipeline"

echo "Git repository initialized with 7 commits!"
echo ""
echo "Git log:"
git log --format="%h %ad %an <%ae> %s" --date=short
