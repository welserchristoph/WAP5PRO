import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router(); 

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

router.get('/bookings/camera/:cameraId', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { cameraId } = req.params;
    
    const bookings = await db.collection('bookings')
      .find({ cameraId: new ObjectId(cameraId) })
      .toArray();
      
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden der Kalenderdaten" });
  }
});

router.get('/my-bookings', async (req, res) => {
  try {
    const db = req.app.get('db');
    
    // Bei express-oauth-server liegt der User hier:
    const oauthUser = res.locals.oauth.token.user;

    if (!oauthUser) {
      return res.status(401).json({ error: "Nicht autorisiert" });
    }

    // Jetzt suchen wir mit der ID des OAuth-Users
    const myBookings = await db.collection('bookings')
      .find({ userId: new ObjectId(oauthUser._id) })
      .toArray();
      
    res.json(myBookings);
  } catch (err) {
    console.error("Fehler bei my-bookings:", err);
    res.status(500).json({ error: "Fehler beim Laden deiner Buchungen" });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { cameraId, startDate, endDate, totalPrice, cameraName } = req.body;

    if (!req.user) return res.status(401).send("Bitte einloggen");

    const newBooking = {
      userId: new ObjectId(req.user._id),
      cameraId: new ObjectId(cameraId),
      cameraName: cameraName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice: totalPrice,
      status: "confirmed",
      bookedAt: new Date()
    };

    const result = await db.collection('bookings').insertOne(newBooking);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: "Buchung fehlgeschlagen" });
  }
});

export default router; 