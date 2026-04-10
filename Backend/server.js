
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2');
const xss = require('xss');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');

const corsOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Secure HTTP headers
app.use(helmet());

// CORS: restrict to your frontend domain in production
app.use(cors({
  origin: corsOrigins.length === 1 && corsOrigins[0] === '*'
    ? '*'
    : (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('CORS not allowed'));
      },
  methods: ['GET', 'POST'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));

// Use a pool for better resilience in production.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

let dbReady = false;
let lastDbError = null;

const checkDbConnection = () => {
  db.query('SELECT 1', (err) => {
    if (err) {
      dbReady = false;
      lastDbError = err.message;
      if (NODE_ENV !== 'test') {
        console.error('Database connection check failed:', err.message);
      }
      return;
    }
    if (!dbReady && NODE_ENV !== 'test') {
      console.log('Database connected');
    }
    dbReady = true;
    lastDbError = null;
  });
};

checkDbConnection();
setInterval(checkDbConnection, 30000).unref();

app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    dbReady,
    lastDbError,
    timestamp: new Date().toISOString(),
  });
});


// Get all picks
app.get('/api/picks', (req, res) => {
  if (!dbReady) return res.status(503).json({ error: 'Database unavailable' });
  db.query('SELECT * FROM picks ORDER BY date DESC, id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});


// Add a new pick (with validation and sanitization)
app.post('/api/picks', (req, res) => {
  if (!dbReady) return res.status(503).json({ error: 'Database unavailable' });
  let { title, description } = req.body;
  if (!title || typeof title !== 'string' || title.length > 100) {
    return res.status(400).json({ error: 'Title is required and must be under 100 characters.' });
  }
  title = xss(title.trim());
  description = description ? xss(description.trim()) : null;

  db.query(
    'INSERT INTO picks (title, description) VALUES (?, ?)',
    [title, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: result.insertId, title, description, date: new Date().toISOString().slice(0, 10) });
    }
  );
});


// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = () => {
  server.close(() => {
    db.end((err) => {
      if (err) console.error('Error closing database pool:', err.message);
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);