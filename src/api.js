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
    const oauthUser = res.locals.oauth.token.user;

    if (!oauthUser) return res.status(401).json({ error: "Nicht autorisiert" });

    const start = new Date(startDate);
    const end = new Date(endDate);

    const existingBooking = await db.collection('bookings').findOne({
      cameraId: new ObjectId(cameraId), 
      $and: [
        { startDate: { $lt: end } },
        { endDate: { $gt: start } } 
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ 
        error: "Die Kamera ist in diesem Zeitraum bereits gebucht." 
      });
    }

    const newBooking = {
      userId: new ObjectId(oauthUser._id),
      cameraId: new ObjectId(cameraId),
      cameraName,
      startDate: start,
      endDate: end,
      totalPrice,
      status: "confirmed",
      bookedAt: new Date()
    };

    const result = await db.collection('bookings').insertOne(newBooking);
    res.status(201).json({ message: "Erfolgreich gebucht!", bookingId: result.insertedId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverfehler bei der Buchung" });
  }
});

export default router; 