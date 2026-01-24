import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import OAuthServer from 'express-oauth-server';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import api from './src/api.js'; 
import register from './src/register.js';
import oAuthModel from './src/oAuthModel.js';

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(express.static('dist'));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: "Zu viele Login-Versuche, bitte warte 15 Minuten."
});

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
      await client.connect();
      app.set('db', client.db('CameraRental'));
    }

    const db = app.get('db');

    if (db) {
      await db.collection('token').createIndex({ accessTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
      await db.collection('token').createIndex({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
      await db.collection('token').createIndex({ emailTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
    }

    const oauth = new OAuthServer({ 
      model: oAuthModel(app),
      accessTokenLifetime: 60 * 60,
      refreshTokenLifetime: 60 * 60 * 24,
      alwaysIssueNewRefreshToken: true
    });

    app.use('/api/token', loginLimiter, oauth.token({ 
      requireClientAuthentication: { password: false, refresh_token: false } 
    }));

    app.use('/api/register', register);
    app.use('/api', oauth.authenticate(), api);
    app.use('/images', express.static(path.join(__dirname, 'public/images')));

    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => {
        console.log(`Server läuft auf http://localhost:${port}`);
      });
    }

  } catch (err) {
    console.error("Fehler beim Server-Start:", err);
  }
};

startServer();

export default app;