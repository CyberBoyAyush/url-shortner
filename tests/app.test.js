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
