const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(bodyParser.json());

// In-memory database for URLs
const urlDatabase = {};

// 🔹 Logging Middleware
async function loggingMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack: "backend",
        level: "info",
        package: "handler",
        message: `API ${req.method} ${req.url} called`,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_TOKEN_HERE`,
        },
      }
    );
  } catch (err) {
    console.error("Log API error:", err.message);
  }

  next();
}

app.use(loggingMiddleware);

// ✅ POST /shorturls → Create Short URL
app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  const code = (shortcode || nanoid(6)).trim();

  if (urlDatabase[code]) {
    return res.status(409).json({ error: 'Shortcode already in use.' });
  }

  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + validity);

  urlDatabase[code] = {
    originalUrl: url,
    expiry: expiry.toISOString(),
    createdAt: new Date().toISOString(),
    clicks: [],
  };

  console.log("Stored short URL:", code, urlDatabase[code]);

  const shortLink = `http://localhost:3000/${code}`;

  res.status(201).json({
    shortLink,
    expiry: urlDatabase[code].expiry,
  });
});

// ✅ GET /shorturls/:code/stats → Retrieve URL Statistics
app.get('/shorturls/:code/stats', (req, res) => {
  const code = req.params.code;
  const data = urlDatabase[code];

  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks.length,
    clickDetails: data.clicks,
  });
});

// ✅ Redirect short URL and track clicks
app.get('/:code', (req, res) => {
  const code = req.params.code;
  const data = urlDatabase[code];

  if (!data) {
    return res.status(404).send('Shortcode not found.');
  }

  const now = new Date();
  if (new Date(data.expiry) < now) {
    return res.status(410).send('Short URL has expired.');
  }

  // Track click
  data.clicks.push({
    timestamp: now.toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  res.redirect(data.originalUrl);
});

// Server running
app.listen(3000, () => {
  console.log('Backend API server running on http://localhost:3000');
});
