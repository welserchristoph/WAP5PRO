import 'dotenv/config'; // MUSS ganz oben stehen [cite: 398, 401]
import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb'; // [cite: 201]
import api from './src/api.js'; // Import deines Routers [cite: 72]

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 

app.use(express.json()); 
app.use(express.static('dist')); 

// Datenbank-Verbindung aufbauen [cite: 202, 203]
try {
 
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING); 
  await client.connect(); 
  
  const db = client.db('CameraRental'); 
  app.set('db', db);
  
  console.log("Erfolgreich mit MongoDB Atlas verbunden!");
} catch (err) {
  console.error("Datenbank konnte nicht verbunden werden:", err); 
}


app.use('/api', api); 

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); 
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});