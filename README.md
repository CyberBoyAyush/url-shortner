# URL Shortener

A simple URL shortener backend built with Node.js and Express for DevOps assignment.

## Features

- **POST /shorten** - Accepts a JSON body with a `url` field and returns a short code
- **GET /:code** - Redirects to the original URL using the short code
- **GET /health** - Returns a health check response

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The server will start on port 3000 (or the port specified by the PORT environment variable).

## Running Tests

```bash
npm test
```

Tests use Jest and Supertest to verify:
- URL shortening returns a valid short code
- Short codes redirect correctly to the original URL
- Unknown short codes return 404
- Health check endpoint works properly

## API Usage

### Shorten a URL

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Response:
```json
{
  "code": "a1b2c3",
  "originalUrl": "https://example.com"
}
```

### Redirect using short code

```bash
curl -L http://localhost:3000/a1b2c3
```

### Health check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": 1712345678901,
  "uptime": 123.456
}
```

## CI/CD

This project includes a Jenkinsfile for continuous integration. The pipeline includes:
1. Checkout - Fetches code from the repository
2. Install Dependencies - Runs `npm install`
3. Run Tests - Executes the Jest test suite
4. Archive Artifact - Creates a zip of the src folder

## Storage

All URLs are stored in-memory (JavaScript Map). Data will be lost when the server restarts.

## License

MIT
