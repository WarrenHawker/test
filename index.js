const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const cors = require('cors');

// Create a Redis client
const redisClient = redis.createClient({
  url: 'redis://default:UbulpgJCHRBrEgNrPcAPCSUgqtAkWMWh@autorack.proxy.rlwy.net:56451',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const app = express();
app.use(
  cors({
    origin: [
      'http://127.0.0.1:5500',
      'https://66d783cb668125d1f612de16--zingy-halva-bc8970.netlify.app',
    ],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);

// Use express-session with Redis store
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key', // Replace this with your own secret
    resave: false, // Prevent session resave if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      sameSite: 'none',
      secure: true,
    },
  })
);

app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  console.log('Response Headers:', res.getHeaders());
  res.send(`Number of views: ${req.session.views}`);
});

const PORT = 3000;
app.listen(PORT, async () => {
  await redisClient.connect();
  await redisClient.flushAll();
  console.log(`Server is running on http://localhost:${PORT}`);
});
