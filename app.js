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
  origin: 'http://localhost:3000' // Nur Anfragen von localhost:3000 
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten Sperrzeit
  max: 10, // Nur 20 Fehlversuche
  message: "Zu viele Login-Versuche, bitte warte 15 Minuten."
});

try {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    await client.connect();
    
    // Datenbank-Verbindung
    const db = client.db('CameraRental'); 
    app.set('db', db); 

    console.log("Erfolgreich mit MongoDB Atlas verbunden!");

    // TTL Indizes für automatische Token-Löschung
    db.collection('token').createIndex({ accessTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
    db.collection('token').createIndex({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
    db.collection('token').createIndex({ emailTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

    // OAuth Server 
    const oauth = new OAuthServer({ 
    model: oAuthModel(db),
    accessTokenLifetime: 60*60,           // 1h 
    refreshTokenLifetime: 60 * 60 * 24, // 24 Stunden für das Refresh-Token
    alwaysIssueNewRefreshToken: true   // Bei jedem Refresh ein neues Token ausstellen
    });


    // Login-Endpunkt (hier wird das Access-Token generiert)
    app.use('/api/token', loginLimiter, oauth.token({ 
    requireClientAuthentication: { 
    password: false, // wir handeln dass über cors und login limiter(rate limit)
    refresh_token: false 
  } 
}));

    app.use('/api/register', register);

    app.use('/api', oauth.authenticate(), api);

    app.get('/test-login', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'test-login.html'));
    });

    app.use(function(req, res) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(port, () => {
        console.log(`Server läuft auf http://localhost:${port}`);
    });

} catch (err) {
    console.error("Fehler beim Server-Start:", err);
}