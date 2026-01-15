import express from 'express';
import { ObjectId } from 'mongodb'; // Wichtig für die ID-Suche [cite: 216]

const router = express.Router(); 

// Alle Kameras aus der DB holen
router.get('/cameras', async (req, res) => {
  try {
    const db = req.app.get('db'); 
    const cameras = await db.collection('cameras').find({}).toArray(); 
    res.json(cameras); 
  } catch (err) {
    res.status(500).send(); 
  }
});


router.get('/cameras/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    
    const camera = await db.collection('cameras').findOne({ _id: new ObjectId(req.params.id) }); 
    
    if (camera) {
      res.json(camera); 
    } else {
      res.status(404).send(); 
    }
  } catch (err) {
    res.status(500).send(); 
  }
});

export default router; 